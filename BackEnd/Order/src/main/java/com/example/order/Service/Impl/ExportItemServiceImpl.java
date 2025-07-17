package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Enum.ExportItemStatus;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Mapper.ExportItemMapper;
import com.example.order.Module.ExportItem;
import com.example.order.Module.ExportOrder;
import com.example.order.Repo.ExportItemRepo;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Service.ExportItemService;
import com.example.order.Service.ExportOrderService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportItemServiceImpl implements ExportItemService {
    AsyncServiceImpl asyncServiceImpl;
    ExportItemMapper exportItemMapper;
    ExportItemRepo exportItemRepo;
    ExportOrderRepo exportOrderRepo;
    ExportOrderService exportOrderService;
    InventoryController inventoryController;

    @Override
    public Page<ExportItemResponse> getAllByWarehouse(Pageable pageable, String warehouse) {
        return exportItemRepo.findAllByExportOrder_Warehouse(warehouse,pageable)
                .map(this::entry);
    }

    @Override
    public List<ExportItemResponse> getAllByOrder(String orderId) {
        return exportItemRepo.findByExportOrder_ExportOrderIdAndIsDeletedFalse(orderId)
                .stream().map(this::entry).collect(Collectors.toList());
    }

    @Override
    public ExportItem getById(String id) {
        return exportItemRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.EXPORT_ITEM_NOT_FOUND));
    }

    @Override
    public ExportItemResponse getByIdResponse(String id) {
        return entry(getById(id));
    }

    @Override
    @Transactional
    public ExportItemResponse createItem(ExportItemRequest request) {
        log.info("Creating export item for order: {}", request.exportOrderId());

        ExportOrder exportOrder = exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(request.exportOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_ORDER_NOT_FOUND));

        ExportItem exportItem = exportItemMapper.toEntity(request);
        exportItem.setIsDeleted(false);
        exportItem.setExportOrder(exportOrder);
        exportItem.setStatus(ExportItemStatus.PENDING);


        ExportItem savedItem = exportItemRepo.save(exportItem);
        log.info("Export item created with ID: {}", savedItem.getExportItemId());

        return entry(savedItem);
    }

    @Override
    @Transactional
    public List<ExportItemResponse> createItems(List<ExportItemRequest> requests) {
        return requests.stream()
                .map(this::createItem)
                .toList();
    }

    @Override
    @Transactional
    public ExportItemResponse updateItem(UpdateExportItemForm update, String id) {
        ExportItem exportItem = getById(id);
        exportItemMapper.toUpdate(exportItem, update);
        exportItem.setUpdatedAt(LocalDateTime.now());

        ExportItem updatedItem = exportItemRepo.save(exportItem);
        return entry(updatedItem);
    }

    @Override
    public void deleteItem(String id) {
        ExportItem exportItem = getById(id);
        exportItem.setDeletedAt(LocalDateTime.now());
        exportItem.setIsDeleted(true);
        exportItemRepo.save(exportItem);
    }

    @Override
    public ExportItemResponse updateQuantity(String itemId, Integer quantity) {
        ExportItem exportItem = getById(itemId);
        exportItem.setQuantity(quantity);
        ExportItem savedItem = exportItemRepo.save(exportItem);
        return entry(savedItem);
    }

    @Override
    public ExportItemResponse updateBinLocation(String itemId, String binLocation) {
        ExportItem exportItem = getById(itemId);
        exportItem.setBinLocation(binLocation);
        ExportItem savedItem = exportItemRepo.save(exportItem);
        return entry(savedItem);
    }

    @Override
    @Transactional
    public void executeExport(String orderId, List<ExportItemResponse> items) {
        log.info("Executing export for order: {}", orderId);

        try {
            // Update order status to IN_PROGRESS
            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.IN_PROGRESS, null);

            // Process each item
            for (ExportItemResponse item : items) {
                // Update item status
                ExportItem exportItem = getById(item.getExportItemId());
                exportItem.setStatus(ExportItemStatus.PICKED);
                exportItemRepo.save(exportItem);

                // Create stock movement for export (decrease inventory)
                StockMovementRequest stockMovementRequest = StockMovementRequest.builder()
                        .product(item.getProduct().getProductId())
                        .inventoryWarehouseId(exportItem.getExportOrder().getWarehouse())
                        .quantity(item.getQuantity())
                        .movementType("EXPORT")
                        .note("Export execution for order: " + orderId)
                        .build();

                // Call inventory service to create stock movement
                inventoryController.createStockMovement(stockMovementRequest);

                // Update item status to SHIPPED
                exportItem.setStatus(ExportItemStatus.SHIPPED);
                exportItemRepo.save(exportItem);
            }

            // Update order status to COMPLETED
            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.COMPLETED, null);

            log.info("Export execution completed for order: {}", orderId);

        } catch (Exception e) {
            log.error("Export execution failed for order: {}", orderId, e);
            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.CANCELLED, null);
            throw new AppException(ErrorCode.EXPORT_EXECUTION_FAILED);
        }
    }

    @Override
    public ExportItemResponse entry(ExportItem exportItem) {
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(exportItem.getProduct());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(exportItem.getExportOrder().getCreateByUser());
        CompletableFuture<UnitNameResponse> unitFuture = asyncServiceImpl
                .getUnitAsync(exportItem.getUnit());
        CompletableFuture.allOf(productFuture, userFuture).join();

        ExportItemResponse response = exportItemMapper.toResponse(exportItem);
        response.setProduct(productFuture.join());
        response.setCreateByUser(userFuture.join());
        response.setUnit(unitFuture.join());
        return response;
    }
}
