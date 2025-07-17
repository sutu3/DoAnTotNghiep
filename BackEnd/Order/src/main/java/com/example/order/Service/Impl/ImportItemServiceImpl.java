package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportItemForm;
import com.example.order.Form.StatusForm;
import com.example.order.Form.UpdateBinRequest;
import com.example.order.Form.UpdateQuantityRequest;
import com.example.order.Mapper.ImportItemMapper;
import com.example.order.Module.ImportItem;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportItemRepo;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Service.ImportItemService;
import com.example.order.Service.ImportOrderService;
import com.example.order.Utils.DateUtils;
import com.example.order.Utils.UpdateOrderTotalPrice;
import jakarta.transaction.Transactional;
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
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ImportItemServiceImpl implements ImportItemService {
    UserController userController;
    ProductController productController;
    WarehouseController warehouseController;
    ImportItemMapper importItemMapper;
    ImportItemRepo importItemRepo;
    UpdateOrderTotalPrice updateOrderTotalPrice;
    private final ImportOrderRepo importOrderRepo;
    private final AsyncServiceImpl asyncServiceImpl;
    private final ImportOrderService importOrderService;
    private final InventoryController inventoryController;

    @Override
    public Page<ImportResponseItem> getAllByWarehouse(Pageable pageable, String warehouse) {
        return importItemRepo.findAllByWarehouseAndIsDeleted(warehouse, false, pageable)
                .map(this::entry);
    }

    @Override
    public List<ImportResponseItem> getAllByOrder( String order) {
        importOrderRepo.findById(order).orElseThrow(()->new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND));
        return importItemRepo.findAllByImportOrder_ImportOrderIdAndIsDeleted(order, false)
                .stream().map(this::entry).collect(Collectors.toList());
    }

    @Override
    public ImportItem getById(String id) {
        return importItemRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ITEM_NOT_FOUND));
    }

    @Override
    public ImportResponseItem getByIdResponse(String id) {
        return entry(getById(id));
    }

    @Override
    public ImportResponseItem createItem(ImportRequestItem requestItem) {
        ImportOrder importOrder= importOrderService.getById(requestItem.importOrder());
        ImportItem importItem=importItemMapper.toEntity(requestItem);
        importItem.setExpiredDate(DateUtils.parseToLocalDateTime(requestItem.expiredDate()).get());
        importItem.setImportOrder(importOrder);
        importItem.setIsDeleted(false);
        ImportItem importItemSave=importItemRepo.save(importItem);
        return entry(importItemSave);
    }

    @Override
    public ImportResponseItem updateItem(ImportItemForm update, String id) {
        ImportItem importItem=importItemRepo.getById(id);
        importItemMapper.toUpdate(importItem,update);
        ImportItem importItemSave=importItemRepo.save(importItem);
        updateOrderTotalPrice.updateTotalPriceImport(importItem.getImportOrder());
        return entry(importItemSave);
    }
    @Override
    public List<ImportResponseItem> createItems(List<ImportRequestItem> requests) {
        List<ImportResponseItem> results = requests.stream()
                .map(this::createItem)
                .toList();

        // Nếu tất cả items thuộc cùng một order, chỉ cần update totalPrice một lần
        if (!requests.isEmpty()) {
            String orderId = requests.get(0).importOrder();
            ImportOrder importOrder = importOrderService.getById(orderId);
            updateOrderTotalPrice.updateTotalPriceImport(importOrder);
        }

        return results;
    }

    @Override
    public void deleteItem(String id) {
        ImportItem importItem=importItemRepo.getById(id);
        importItemRepo.deleteById(importItem.getItemId());
    }

    @Override
    public ImportResponseItem entry(ImportItem importItem) {
        CompletableFuture<UnitNameResponse> unitFuture=asyncServiceImpl
                .getUnitAsync(importItem.getUnit());
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(importItem.getProduct());
        CompletableFuture<SupplierResponse> supplierFuture = asyncServiceImpl
                .getSupplierAsync(importItem.getSupplier());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(importItem.getCreateByUser());
        CompletableFuture.allOf( unitFuture,productFuture,supplierFuture,userFuture).join();
        ImportResponseItem importResponseItem=importItemMapper.toResponse(importItem);
        if(importItem.getBin()!=null){
            CompletableFuture<BinResponse> binFurute = asyncServiceImpl
                    .getBinAsync(importItem.getBin());
            importResponseItem.setBin(binFurute.join());
        }
        importResponseItem.setCreateByUser(userFuture.join());
        importResponseItem.setSupplier(supplierFuture.join());
        importResponseItem.setProduct(productFuture.join());
        importResponseItem.setUnit(unitFuture.join());
        return importResponseItem;
    }

    @Override
    public List<String> getRecentSuppliersByProduct(String productId, String warehouseId) {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

        // Query để lấy suppliers gần đây nhất
        List<ImportItem> recentItems = importItemRepo.findRecentImportItemsByProductAndWarehouse(
                productId, warehouseId, sixMonthsAgo, false
        );

        // Extract supplier IDs và lấy thông tin chi tiết
        return recentItems.stream()
                .map(ImportItem::getSupplier)
                .distinct()
                .limit(5) // Giới hạn 5 suppliers gần nhất
                .map(supplierId -> {
                    try {
                        SupplierResponse supplier = userController.getSupplier(supplierId).getResult();
                        return supplier.getSupplierName();
                    } catch (Exception e) {
                        log.warn("Cannot fetch supplier info for ID: {}", supplierId);
                        return "Unknown Supplier";
                    }
                })
                .collect(Collectors.toList());
    }

    @Override
    public ImportResponseItem updateRealityQuantity(String itemId, UpdateQuantityRequest request) {
        // Lấy ImportItem theo ID
        ImportItem importItem = getById(itemId);

        // Validate quantity không âm
        if (request.realityQuantity() < 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        // Cập nhật reality quantity
        importItem.setRealityQuantity(request.realityQuantity());
        importItem.setImportAt(LocalDateTime.now());
        importItem.setUpdatedAt(LocalDateTime.now());

        // Lưu vào database
        ImportItem savedItem = importItemRepo.save(importItem);

        // Cập nhật total price của order
        updateOrderTotalPrice.updateTotalPriceImport(importItem.getImportOrder());

        return entry(savedItem);
    }

    @Override
    public ImportResponseItem updateBinLocation(String itemId, UpdateBinRequest request) {
        // Lấy ImportItem theo ID
        ImportItem importItem = getById(itemId);

        // Validate bin tồn tại thông qua WarehouseService
        if (request.binId() != null && !request.binId().isEmpty()) {
            try {
                warehouseController.getBinById(request.binId());
            } catch (Exception e) {
                throw new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND);
            }
        }

        // Cập nhật bin location
        importItem.setBin(request.binId());
        importItem.setUpdatedAt(LocalDateTime.now());

        // Lưu vào database
        ImportItem savedItem = importItemRepo.save(importItem);

        return entry(savedItem);
    }

    private void createInventoryRecords(ImportResponseItem item, ImportOrderResponse orderResponse) {
        try {
            log.info("Creating inventory records for item: {}", item.getProduct().getProductName());

            // Tạo inventory warehouse record
            InventoryWarehouseRequest inventoryWarehouseRequest = new InventoryWarehouseRequest(
                    item.getProduct().getProductId(),
                    orderResponse.getWarehouse().getWarehouseId(),
                    item.getBin().getBinId(),
                    0,
                    item.getExpiredDate().toLocalDate(),
                    "AVAILABLE"
            );
            var inventoryResponse = inventoryController.createInventoryWarehouse(inventoryWarehouseRequest);
            log.info("Created inventory warehouse record with ID: {}",
                    inventoryResponse.getResult().getInventoryWarehouseId());

            // Tạo stock movement record
            StockMovementRequest stockMovementRequest = new StockMovementRequest(
                    inventoryResponse.getResult().getInventoryWarehouseId(), // Sử dụng ID từ response
                    item.getProduct().getProductId(),
                    "IMPORT",
                    item.getRealityQuantity(),
                    orderResponse.getImportOrderId(),
                    item.getCreateByUser().getUserId(), // Thêm user thực hiện
                    "Import from order: " + orderResponse.getImportOrderId(), // Thêm note
                    item.getCostUnitBase()
            );

            var movementResponse = inventoryController.createStockMovement(stockMovementRequest);
            log.info("Created stock movement record with ID: {}",
                    movementResponse.getResult().getMovementId());

        } catch (Exception e) {
            log.error("Failed to create inventory records for item: {}", item.getItemId(), e);
            throw new AppException(ErrorCode.INVENTORY_CREATION_FAILED);
        }
    }
    @Override
    @Transactional
    public void executeImport(String orderId, List<ImportResponseItem> items) {
        try {
            log.info("Starting import execution for order: {}", orderId);

            // Update order status
            StatusForm update = new StatusForm("Done");
            ImportOrderResponse orderResponse = importOrderService.updateStatus(orderId, update);

            int processedItems = 0;
            for (ImportResponseItem item : items) {
                try {
                    // Update item details
                    updateRealityQuantity(item.getItemId(),
                            new UpdateQuantityRequest(item.getRealityQuantity()));
                    updateBinLocation(item.getItemId(),
                            new UpdateBinRequest(item.getBin().getBinId()));

                    // Create inventory records
                    createInventoryRecords(item, orderResponse);

                    processedItems++;
                    log.info("Processed item {}/{}: {}", processedItems, items.size(),
                            item.getProduct().getProductName());

                } catch (Exception e) {
                    log.error("Failed to process item: {}", item.getItemId(), e);
                    throw new AppException(ErrorCode.IMPORT_EXECUTION_FAILED);
                }
            }

            log.info("Successfully completed import for order: {} with {} items",
                    orderId, processedItems);

        } catch (Exception e) {
            log.error("Import execution failed for order: {}", orderId, e);
            throw e;
        }
    }
}
