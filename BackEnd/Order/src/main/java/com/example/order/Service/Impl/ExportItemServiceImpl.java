package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Enum.ExportItemStatus;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Enum.OrderStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Mapper.ExportItemMapper;
import com.example.order.Module.ExportItem;
import com.example.order.Module.ExportOrder;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ExportItemRepo;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Service.ExportItemService;
import com.example.order.Service.ExportOrderService;
import com.example.order.Utils.UpdateOrderTotalPrice;
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
    UpdateOrderTotalPrice updateOrderTotalPrice;

    @Override
    public Page<ExportItemResponse> getAllByWarehouse(Pageable pageable, String warehouse) {
        return exportItemRepo.findAllByExportOrder_Warehouse(warehouse,pageable)
                .map(this::entry);
    }

    @Override
    public List<ExportItemResponse> getAllByOrder(String orderId) {
        log.info(orderId);
        return exportItemRepo.findAllByExportOrder_ExportOrderIdAndIsDeleted(orderId,false)
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
        List<ExportItemResponse> results = requests.stream()
                .map(this::createItem)
                .toList();
        if (!requests.isEmpty()) {
            String orderId = requests.get(0).exportOrderId();
            ExportOrder importOrder = exportOrderService.getExportOrderById(orderId);
            updateOrderTotalPrice.updateTotalPriceExport(importOrder);
        }

        return results;
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
    public void executeExport(String orderId, List<ExportItemRequest> items) {
        log.info("=== STARTING EXPORT EXECUTION ===");
        log.info("Executing export for order: {}", orderId);
        var idUser=GetCurrentUserId.getCurrentUserId();
        try {
            // Update order status to IN_PROGRESS
            log.info("Step 1: Updating order status to IN_PROGRESS for order: {}", orderId);
            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.IN_PROGRESS);
            log.info("Order status updated successfully to IN_PROGRESS");

            // Get all items by order
            log.info("Step 2: Fetching all export items for order: {}", orderId);
            List<ExportItemResponse> list = getAllByOrder(orderId);
            log.info("Found {} export items for order: {}", list.size(), orderId);

            // Process each item
            int itemIndex = 0;
            for (ExportItemResponse item : list) {
                itemIndex++;
                log.info("=== PROCESSING ITEM {}/{} ===", itemIndex, list.size());
                log.info("Item details - ID: {}, Product: {}, Quantity: {}, Bin: {}",
                        item.getExportItemId(),
                        item.getProduct().getProductName(),
                        item.getQuantity(),
                        item.getBin().getBinCode());

                try {
                    // Update item status to PICKED
                    log.info("Step 3.{}.1: Fetching export item entity by ID: {}", itemIndex, item.getExportItemId());
                    ExportItem exportItem = getById(item.getExportItemId());
                    log.info("Export item found - Current status: {}", exportItem.getStatus());

                    log.info("Step 3.{}.2: Updating item status to PICKED", itemIndex);
                    exportItem.setStatus(ExportItemStatus.PICKED);
                    exportItemRepo.save(exportItem);
                    log.info("Item status updated to PICKED successfully");

                    // Get inventory warehouse info
                    log.info("Step 3.{}.3: Calling inventory service to get warehouse info for bin: {}",
                            itemIndex, item.getBin().getBinId());
                    InventoryWarehouseResponse inventoryWarehouseResponse = inventoryController
                            .getInventoryWarehouse(item.getBin().getBinId()).getResult();
                    log.info("Inventory warehouse response received - ID: {}, Available quantity: {}",
                            inventoryWarehouseResponse.getInventoryWarehouseId());

                    // Create stock movement for export
                    log.info("Step 3.{}.4: Creating stock movement request", itemIndex);
                    StockMovementRequest stockMovementRequest = StockMovementRequest.builder()
                            .product(item.getProduct().getProductId())
                            .inventoryWarehouseId(inventoryWarehouseResponse.getInventoryWarehouseId())
                            .quantity(item.getQuantity())
                            .movementType("Export")
                            .referenceOrderId(orderId)
                            .performedBy(idUser)
                            .unitCost(item.getUnitPrice())
                            .note("Export execution for order: " + orderId)
                            .build();
//                    StockMovementRequest stockMovementRequest = new StockMovementRequest(
//                            inventoryWarehouseResponse.getInventoryWarehouseId(), // Sử dụng ID từ response
//                            item.getProduct().getProductId(),
//                            "Export",
//                            item.getQuantity(),
//                            orderId,
//                            item.getCreateByUser().getUserId(), // Thêm user thực hiện
//                            "Export execution for order: " + orderId, // Thêm note
//                            item.getUnitPrice()
//                    );

                    log.info("Stock movement request: {}", stockMovementRequest);

                    // Call inventory service to create stock movement
                    log.info("Step 3.{}.5: Calling inventory service to create stock movement...", itemIndex);
                    var stockMovementResponse = inventoryController.createStockMovement(stockMovementRequest);
                    log.info("Stock movement created successfully - Response: {}", stockMovementResponse);

                    // Update item status to SHIPPED
                    log.info("Step 3.{}.6: Updating item status to SHIPPED", itemIndex);
                    exportItem.setStatus(ExportItemStatus.SHIPPED);
                    exportItemRepo.save(exportItem);
                    log.info("Item status updated to SHIPPED successfully");

                    log.info("=== ITEM {}/{} PROCESSED SUCCESSFULLY ===", itemIndex, list.size());

                } catch (Exception itemException) {
                    log.error("=== FAILED TO PROCESS ITEM {}/{} ===", itemIndex, list.size());
                    log.error("Item ID: {}, Product: {}, Bin: {}",
                            item.getExportItemId(),
                            item.getProduct().getProductName(),
                            item.getBin().getBinCode());
                    log.error("Exception details:", itemException);
                    throw itemException;
                }
            }

            // Update order status to COMPLETED
            log.info("Step 4: All items processed successfully. Updating order status to COMPLETED");
            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.COMPLETED);
            log.info("Order status updated to COMPLETED successfully");

            log.info("=== EXPORT EXECUTION COMPLETED SUCCESSFULLY ===");
            log.info("Export execution completed for order: {} with {} items processed", orderId, list.size());

        } catch (Exception e) {
            log.error("=== EXPORT EXECUTION FAILED ===");
            log.error("Export execution failed for order: {}", orderId);
            log.error("Exception type: {}", e.getClass().getSimpleName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Full stack trace:", e);

            try {
                log.info("Step 5: Setting order status to CANCELLED due to failure");
                exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.CANCELLED);
                log.info("Order status set to CANCELLED successfully");
            } catch (Exception statusUpdateException) {
                log.error("Failed to update order status to CANCELLED", statusUpdateException);
            }

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
        CompletableFuture<BinResponse> binFuture = asyncServiceImpl
                .getBinAsync(exportItem.getBinLocation());
        CompletableFuture.allOf(productFuture, userFuture,binFuture).join();

        ExportItemResponse response = exportItemMapper.toResponse(exportItem);
        response.setProduct(productFuture.join());
        response.setCreateByUser(userFuture.join());
        response.setUnit(unitFuture.join());
        response.setBin(binFuture.join());
        return response;
    }
}
