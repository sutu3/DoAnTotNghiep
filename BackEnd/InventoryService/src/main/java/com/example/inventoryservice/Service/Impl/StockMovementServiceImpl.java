package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Form.UpdateOccupancyRequest;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Client.WarehouseService.WarehouseClient;
import com.example.inventoryservice.Dtos.Request.StockMovementRequest;
import com.example.inventoryservice.Dtos.Response.StockMovementResponse;
import com.example.inventoryservice.Enum.MovementType;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryWarehouseForm;
import com.example.inventoryservice.Mapper.StockMovementMapper;
import com.example.inventoryservice.Module.InventoryWarehouse;
import com.example.inventoryservice.Module.StockMovement;
import com.example.inventoryservice.Repo.StockMovementRepo;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import com.example.inventoryservice.Service.StockMovementService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StockMovementServiceImpl implements StockMovementService {

    StockMovementRepo stockMovementRepo;
    StockMovementMapper stockMovementMapper;
    InventoryWarehouseService inventoryWarehouseService;
    ProductController productController;
    UserController userController;
    AsyncServiceImpl asyncServiceImpl;
    private final WarehouseController warehouseController;
    private final WarehouseClient warehouseClient;

    @Override
    public Page<StockMovementResponse> getAllByProduct(Pageable pageable, String product) {
        return stockMovementRepo.findAllByProductAndIsDeleted(product, false, pageable)
                .map(this::enrich);
    }

    @Override
    public Page<StockMovementResponse> getAllByInventoryWarehouse(Pageable pageable, String inventoryWarehouseId) {
        return stockMovementRepo.findAllByInventoryWarehouseIdAndIsDeleted(inventoryWarehouseId, false, pageable)
                .map(this::enrich);
    }

    @Override
    public StockMovement getById(String id) {
        return stockMovementRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STOCK_MOVEMENT_NOT_FOUND));
    }

    @Override
    public StockMovementResponse getByIdResponse(String id) {
        return enrich(getById(id));
    }

    @Override
    public StockMovementResponse createStockMovement(StockMovementRequest request) {
        // Validate references
        InventoryWarehouse inventoryWarehouse = inventoryWarehouseService.getById(request.inventoryWarehouseId());
        productController.getProductById(request.product());

        if (request.performedBy() != null) {
            userController.getUser(request.performedBy());
        }

        StockMovement stockMovement = stockMovementMapper.toEntity(request);

        // Set quantity before and after
        stockMovement.setQuantityBefore(inventoryWarehouse.getQuantity());

        switch (stockMovement.getMovementType()) {
            case IMPORT:
                stockMovement.setQuantityAfter(inventoryWarehouse.getQuantity() + request.quantity());
                break;
            case EXPORT:
                if (inventoryWarehouse.getQuantity() < request.quantity()) {
                    throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                }
                stockMovement.setQuantityAfter(inventoryWarehouse.getQuantity() - request.quantity());
                break;
            case ADJUSTMENT:
                stockMovement.setQuantityAfter(request.quantity());
                break;
            case TRANSFER:
                // For transfer, this would need additional logic to handle destination
                stockMovement.setQuantityAfter(inventoryWarehouse.getQuantity() - request.quantity());
                break;
        }
        updateBinOccupancy(inventoryWarehouse.getBin(), inventoryWarehouse.getQuantity(),stockMovement.getMovementType());
        stockMovement.setIsDeleted(false);
        StockMovement savedMovement = stockMovementRepo.save(stockMovement);

        // Update inventory warehouse quantity
        updateInventoryWarehouseQuantity(inventoryWarehouse, stockMovement.getQuantityAfter());

        return enrich(savedMovement);
    }
    @Override
    public void updateBinOccupancy(String binId, Integer quantityChange, MovementType movementType) {
        try {
            Integer occupancyChange = switch (movementType) {
                case IMPORT -> quantityChange;
                case EXPORT -> -quantityChange;
                case TRANSFER -> 0; // Sẽ xử lý riêng cho from/to bins
                case ADJUSTMENT -> quantityChange; // Có thể âm hoặc dương
            };
            UpdateOccupancyRequest request= UpdateOccupancyRequest.builder()
                    .occupancyChange(occupancyChange)
                    .build();
            warehouseClient.updateBinOccupancy(binId, request);
        } catch (Exception e) {
            log.warn("Failed to update bin occupancy for bin: {}", binId, e);
            // Không throw exception để không ảnh hưởng đến stock movement
        }
    }
    @Override
    public List<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockMovementRepo.findByDateRange(startDate, endDate)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public StockMovementResponse enrich(StockMovement stockMovement) {
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(stockMovement.getProduct());

        CompletableFuture<UserResponse> userFuture = null;
        if (stockMovement.getPerformedBy() != null) {
            userFuture = asyncServiceImpl.getUserAsync(stockMovement.getPerformedBy());
        }

        if (userFuture != null) {
            CompletableFuture.allOf(productFuture, userFuture).join();
        } else {
            CompletableFuture.allOf(productFuture).join();
        }

        StockMovementResponse response = stockMovementMapper.toResponse(stockMovement);
        response.setProductDetails(productFuture.join());

        if (userFuture != null) {
            response.setPerformedByUser(userFuture.join());
        }

        return response;
    }

    private void updateInventoryWarehouseQuantity(InventoryWarehouse inventoryWarehouse, Integer newQuantity) {
        inventoryWarehouse.setQuantity(newQuantity);
        inventoryWarehouse.setUpdatedAt(LocalDateTime.now());
        inventoryWarehouseService.updateInventoryWarehouse(
                InventoryWarehouseForm.builder()
                        .quantity(newQuantity)
                        .bin(inventoryWarehouse.getBin())
                        .expiryDate(inventoryWarehouse.getExpiryDate())
                        .status(inventoryWarehouse.getStatus().toString())
                        .build(),
                inventoryWarehouse.getInventoryWarehouseId()
        );
    }
}
