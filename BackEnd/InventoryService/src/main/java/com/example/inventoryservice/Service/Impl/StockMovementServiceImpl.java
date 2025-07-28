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
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    @Transactional
    public StockMovementResponse createStockMovement(StockMovementRequest request) {

        log.info("Updating inventory record with ID: {}",request.getQuantity());
        var userId=GetCurrentUserId.getCurrentUserId();
        request.setPerformedBy(userId);
        log.info("=== STARTING STOCK MOVEMENT CREATION ===");
        log.info("Request details - Product: {}, InventoryWarehouseId: {}, Quantity: {}, MovementType: {}",
                request.getProduct(), request.getInventoryWarehouseId(), request.getQuantity(), request.getMovementType());

        try {
            // Validate references
            log.info("Step 1: Validating inventory warehouse with ID: {}", request.getInventoryWarehouseId());
            InventoryWarehouse inventoryWarehouse = inventoryWarehouseService.getById(request.getInventoryWarehouseId());
            log.info("Inventory warehouse found - Current quantity: {}, Bin: {}",
                    inventoryWarehouse.getQuantity(), inventoryWarehouse.getBin());

            log.info("Step 2: Validating product with ID: {}", request.getProduct());
            var productResponse = productController.getProductById(request.getProduct());
            log.info("Product validation successful: {}", productResponse);

            if (request.getPerformedBy() != null) {
                log.info("Step 3: Validating user with ID: {}", request.getPerformedBy());
                var userResponse = userController.getUser(request.getPerformedBy());
                log.info("User validation successful: {}", userResponse);
            } else {
                log.info("Step 3: No performedBy user specified, skipping user validation");
            }

            log.info("Step 4: Mapping request to entity");
            request.setMovementType(String.valueOf(request.getMovementType()).toUpperCase());
            StockMovement stockMovement = stockMovementMapper.toEntity(request);
            log.info("Entity mapping successful");

            // Set quantity before and after
            log.info("Step 5: Setting quantity calculations");
            stockMovement.setQuantityBefore(inventoryWarehouse.getQuantity());
            log.info("Quantity before set to: {}", inventoryWarehouse.getQuantity());

            log.info("Step 6: Processing movement type: {}", stockMovement.getMovementType());
            switch ( MovementType.valueOf(String.valueOf(stockMovement.getMovementType()).toUpperCase()) ) {
                case IMPORT:
                    log.info("Processing IMPORT movement");
                    BigDecimal newQuantityImport = inventoryWarehouse.getQuantity().add(request.getQuantity());
                    stockMovement.setQuantityAfter(newQuantityImport);
                    log.info("IMPORT: {} + {} = {}", inventoryWarehouse.getQuantity(), request.getQuantity(), newQuantityImport);
                    break;
                case EXPORT:
                    log.info("Processing EXPORT movement");
                    if (inventoryWarehouse.getQuantity().compareTo(request.getQuantity()) < 0) {
                        log.error("INSUFFICIENT_STOCK: Available {} < Required {}",
                                inventoryWarehouse.getQuantity(), request.getQuantity());
                        throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                    }
                    BigDecimal newQuantityExport = inventoryWarehouse.getQuantity().subtract(request.getQuantity());
                    stockMovement.setQuantityAfter(newQuantityExport);
                    log.info("EXPORT: {} - {} = {}", inventoryWarehouse.getQuantity(), request.getQuantity(), newQuantityExport);
                    break;
                case ADJUSTMENT:
                    log.info("Processing ADJUSTMENT movement");
                    stockMovement.setQuantityAfter(request.getQuantity());
                    log.info("ADJUSTMENT: Set quantity to {}", request.getQuantity());

                    // Bổ sung logic cho trường hợp quantity = 0
                    if (request.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
                        log.info("Quantity adjusted to 0, marking inventory warehouse for deletion");
                        inventoryWarehouseService.deleteInventoryWarehouse(request.getInventoryWarehouseId());
                        // Sẽ xóa InventoryWarehouse record sau khi save movement
                    }
                    break;
                case TRANSFER:
                    log.info("Processing TRANSFER movement");
                    BigDecimal newQuantityTransfer = inventoryWarehouse.getQuantity().subtract(request.getQuantity());
                    stockMovement.setQuantityAfter(newQuantityTransfer);
                    log.info("TRANSFER: {} - {} = {}", inventoryWarehouse.getQuantity(), request.getQuantity(), newQuantityTransfer);
                    break;
            }

            log.info("Step 7: Updating bin occupancy for bin: {}", inventoryWarehouse.getBin());
            updateBinOccupancy(inventoryWarehouse.getBin(), request.getQuantity(),
                    MovementType.valueOf(String.valueOf(stockMovement.getMovementType()).toUpperCase()));              log.info("Bin occupancy updated successfully");

            log.info("Step 8: Setting entity properties and saving");
            stockMovement.setIsDeleted(false);
            StockMovement savedMovement = stockMovementRepo.save(stockMovement);
            log.info("Stock movement saved with ID: {}", savedMovement.getMovementId());

            log.info("Step 9: Updating inventory warehouse quantity to: {}", stockMovement.getQuantityAfter());
            updateInventoryWarehouseQuantity(inventoryWarehouse, stockMovement.getQuantityAfter());
            log.info("Inventory warehouse quantity updated successfully");

            log.info("Step 10: Enriching response");
            StockMovementResponse response = enrich(savedMovement);
            log.info("Response enrichment completed");

            log.info("=== STOCK MOVEMENT CREATION COMPLETED SUCCESSFULLY ===");
            log.info("Created movement ID: {} with quantity change: {} -> {}",
                    savedMovement.getMovementId(), stockMovement.getQuantityBefore(), stockMovement.getQuantityAfter());

            return response;

        } catch (Exception e) {
            log.error("=== STOCK MOVEMENT CREATION FAILED ===");
            log.error("Failed to create stock movement for request: {}", request);
            log.error("Exception type: {}", e.getClass().getSimpleName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Full stack trace:", e);
            throw e;
        }
    }
    @Override
    @Transactional
    public void updateBinOccupancy(String binId, BigDecimal quantityChange, MovementType movementType) {
        try {
            BigDecimal  occupancyChange = switch (movementType) {
                case IMPORT -> quantityChange;
                case EXPORT -> quantityChange.negate();
                case TRANSFER -> BigDecimal.ZERO;
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

    @Override
    public List<StockMovementResponse> getStockMovementsByWarehouseAndDateRange(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        log.info("Getting stock movements for warehouse: {} from {} to {}", warehouseId, fromDate, toDate);

        List<StockMovement> movements = stockMovementRepo.findByWarehouseAndDateRange(warehouseId, fromDate, toDate);

        return movements.stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    private void updateInventoryWarehouseQuantity(InventoryWarehouse inventoryWarehouse, BigDecimal newQuantity) {
        if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
            inventoryWarehouseService.deleteInventoryWarehouse(inventoryWarehouse.getInventoryWarehouseId());
            log.info("InventoryWarehouse deleted due to zero quantity");
        } else {
            // Cập nhật quantity bình thường
            inventoryWarehouse.setQuantity(newQuantity);
            inventoryWarehouse.setUpdatedAt(LocalDateTime.now());
            inventoryWarehouseService.updateInventoryWarehouse(
                    InventoryWarehouseForm.builder()
                            .quantity(newQuantity)
                            .bin(inventoryWarehouse.getBin())
                            .expiryDate(inventoryWarehouse.getExpiryDate())
                            .status(inventoryWarehouse.getStatus().toString())
                            .build(),
                    inventoryWarehouse.getInventoryWarehouseId());
        }
    }
}
