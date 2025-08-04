package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Dto.Request.ReceiptItemRequest;
import com.example.order.Dto.Request.WarehouseReceiptRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Dto.Response.ReceiptItem.ReceiptItemResponse;
import com.example.order.Dto.Response.WarehouseReceipt.WarehouseReceiptResponse;
import com.example.order.Enum.OrderStatus;
import com.example.order.Enum.ReceiptStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.UpdateBinRequest;
import com.example.order.Form.UpdateQuantityRequest;
import com.example.order.Mapper.ImportOrderMapper;
import com.example.order.Mapper.ReceiptItemMapper;
import com.example.order.Mapper.WarehouseReceiptMapper;
import com.example.order.Module.ImportOrder;
import com.example.order.Module.ReceiptItem;
import com.example.order.Module.WarehouseReceipt;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Repo.ReceiptItemRepo;
import com.example.order.Repo.WarehouseReceiptRepo;
import com.example.order.Service.ImportItemService;
import com.example.order.Service.ImportOrderService;
import com.example.order.Service.WarehouseReceiptService;
import com.example.order.Utils.ConvertToBaseUnit;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

// BackEnd/Order/src/main/java/com/example/order/Service/Impl/WarehouseReceiptServiceImpl.java
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class WarehouseReceiptServiceImpl implements WarehouseReceiptService {

    WarehouseReceiptRepo warehouseReceiptRepo;
    ReceiptItemRepo receiptItemRepo;
    ImportOrderService importOrderService;
    InventoryController inventoryServiceClient;
    ImportOrderRepo importOrderRepo;
    ImportItemService importItemService;
    WarehouseReceiptMapper warehouseReceiptMapper;
    AsyncServiceImpl asyncServiceImpl;
    ImportOrderMapper importOrderMapper;
    ReceiptItemMapper receiptItemMapper;
    InventoryController inventoryController;
    ConvertToBaseUnit convertToBaseUnit;

    @Override
    @Transactional
    public WarehouseReceiptResponse createReceipt(WarehouseReceiptRequest request) {
        // Validate import order exists and has correct status
        ImportOrder importOrder = importOrderService.getById(request.getImportOrderId());
        if (importOrder.getStatus() != OrderStatus.Goods_Arrived) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        // Create warehouse receipt
        WarehouseReceipt receipt = WarehouseReceipt.builder()
                .importOrder(importOrder)
                .createdByUser(GetCurrentUserId.getCurrentUserId())
                .receivedDate(LocalDateTime.now())
                .status(ReceiptStatus.PENDING)
                .warehouse(importOrder.getWarehouse())
                .isDeleted(false)
                .note(request.getNote())
                .build();

        WarehouseReceipt savedReceipt = warehouseReceiptRepo.save(receipt);

        // Create receipt items
        List<ReceiptItem> receiptItems = request.getReceiptItems().stream()
                .map(itemRequest -> ReceiptItem.builder()
                        .warehouseReceipt(savedReceipt)
                        .importItem(importItemService.getById(itemRequest.getImportItemId()))
                        .receivedQuantity(itemRequest.getReceivedQuantity())
                        .binLocation(itemRequest.getBinLocation())
                        .isDeleted(false)
                        .receivedAt(LocalDateTime.now())
                        .note(itemRequest.getNote())
                        .build())
                .collect(Collectors.toList());

        receiptItemRepo.saveAll(receiptItems);
        savedReceipt.setReceiptItems(receiptItems);

        // Update import order status
        importOrder.setStatus(OrderStatus.Done);
        importOrderRepo.save(importOrder);
        return warehouseReceiptMapper.toResponse(savedReceipt);
    }

    @Override
    public WarehouseReceipt getById(String receiptId) {
        WarehouseReceipt receipt = warehouseReceiptRepo.findById(receiptId)
                .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_RECEIPT_NOT_FOUND));
        return receipt;
    }
    @Override
    public WarehouseReceiptResponse getByIdResponse(String receiptId) {
        WarehouseReceipt receipt = getById(receiptId);
        return warehouseReceiptMapper.toResponse(receipt);
    }
    @Override
    public List<WarehouseReceiptResponse> getByOrderId(String orderId) {
        List<WarehouseReceipt> receipts = warehouseReceiptRepo.findAllByImportOrder_ImportOrderIdAndIsDeleted(orderId, false);
        return receipts.stream()
                .map(warehouseReceiptMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WarehouseReceiptResponse addReceiptItem(String receiptId, ReceiptItemRequest request) {
        WarehouseReceipt receipt = warehouseReceiptRepo.findById(receiptId)
                .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_RECEIPT_NOT_FOUND));

        if (receipt.getStatus() == ReceiptStatus.COMPLETED) {
            throw new AppException(ErrorCode.RECEIPT_ALREADY_COMPLETED);
        }

        ReceiptItem newItem = ReceiptItem.builder()
                .warehouseReceipt(receipt)
                .importItem(importItemService.getById(request.getImportItemId()))
                .receivedQuantity(request.getReceivedQuantity())
                .binLocation(request.getBinLocation())
                .receivedAt(LocalDateTime.now())
                .note(request.getNote())
                .build();

        receiptItemRepo.save(newItem);

        // Refresh receipt with new item
        receipt = warehouseReceiptRepo.findById(receiptId).get();
        return warehouseReceiptMapper.toResponse(receipt);
    }

    @Override
    @Transactional
    public WarehouseReceiptResponse updateReceiptStatus(String receiptId, ReceiptStatus status) {
        WarehouseReceipt receipt = warehouseReceiptRepo.findById(receiptId)
                .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_RECEIPT_NOT_FOUND));

        receipt.setStatus(status);
        receipt.setUpdatedAt(LocalDateTime.now());

        WarehouseReceipt savedReceipt = warehouseReceiptRepo.save(receipt);
        return warehouseReceiptMapper.toResponse(savedReceipt);
    }

    @Override
    public List<WarehouseReceiptResponse> getAllByWarehouseId(String warehouseId) {
        List<WarehouseReceipt> warehouseReceipts=warehouseReceiptRepo.findAllByWarehouseAndIsDeleted(warehouseId, false);
        return warehouseReceipts.stream()
                .map(this::entry)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReceiptItemResponse> getAllReceiptItemsByReceiptId(String receiptId) {
        WarehouseReceipt receipt = warehouseReceiptRepo.findById(receiptId)
                .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_RECEIPT_NOT_FOUND));
        return receipt.getReceiptItems().stream().map(
                this::enrichReceiptItem
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void completeReceipt(String receiptId) {
        WarehouseReceipt receipt = warehouseReceiptRepo.findById(receiptId)
                .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_RECEIPT_NOT_FOUND));

        // Update inventory for each received item
        for (ReceiptItem item : receipt.getReceiptItems()) {
            updateInventory(item);
        }

        // Update receipt status
        receipt.setStatus(ReceiptStatus.COMPLETED);
        receipt.setUpdatedAt(LocalDateTime.now());
        warehouseReceiptRepo.save(receipt);

        // Update import order status to Done
        ImportOrder importOrder = receipt.getImportOrder();
        importOrder.setStatus(OrderStatus.Done);
        importOrderRepo.save(importOrder);
    }
    private void createInventoryRecords(ReceiptItem item, WarehouseReceipt orderResponse) {
        try {
            // Tạo inventory warehouse record
            InventoryWarehouseRequest inventoryWarehouseRequest = new InventoryWarehouseRequest(
                    item.getImportItem().getProduct(),
                    orderResponse.getWarehouse(),
                    item.getBinLocation(),
                    BigDecimal.ZERO,
                    item.getImportItem().getExpiredDate().toLocalDate(),
                    "AVAILABLE"
            );
            var inventoryResponse = inventoryController.createInventoryWarehouse(inventoryWarehouseRequest);
            log.info("Created inventory warehouse record with ID: {}",
                    inventoryResponse.getResult().getInventoryWarehouseId());

            // Tạo stock movement record
            StockMovementRequest stockMovementRequest = new StockMovementRequest(
                    inventoryResponse.getResult().getInventoryWarehouseId(), // Sử dụng ID từ response
                    item.getImportItem().getProduct(),
                    "Import",
                    convertToBaseUnit.convertToBaseUnitPreciseReceipt(item),
                    orderResponse.getImportOrder().getImportOrderId(),
                    GetCurrentUserId.getCurrentUserId(), // Thêm user thực hiện
                    "Import from order: " + orderResponse.getImportOrder().getImportOrderId(), // Thêm note
                    item.getImportItem().getCostUnitBase()
            );

            var movementResponse = inventoryController.createStockMovement(stockMovementRequest);
            log.info("Created stock movement record with ID: {}",
                    movementResponse.getResult().getMovementId());

        } catch (Exception e) {
            log.error("Failed to create inventory records for item: {}", item.getReceiptItemId(), e);
            throw new AppException(ErrorCode.INVENTORY_CREATION_FAILED);
        }
    }

    private void updateInventory(ReceiptItem receiptItem) {
        // Tạo StockMovementRequest để ghi nhận việc nhập hàng
        BigDecimal quantity=convertToBaseUnit.convertToBaseUnitPreciseReceipt(receiptItem);
        log.info("Updating inventory record with ID: {}",quantity.toString());
        StockMovementRequest stockMovementRequest = StockMovementRequest.builder()
                .product(receiptItem.getImportItem().getProduct())
                .inventoryWarehouseId(getOrCreateInventoryWarehouseId(receiptItem))
                .movementType("IMPORT")
                .quantity(quantity)
                .unitCost(receiptItem.getImportItem().getCostUnitBase())
                .performedBy(receiptItem.getWarehouseReceipt().getCreatedByUser())
                .referenceOrderId(receiptItem.getImportItem().getImportOrder().getImportOrderId())
                .note("Nhập kho từ phiếu: " + receiptItem.getWarehouseReceipt().getReceiptId())
                .build();
        try {
            inventoryServiceClient.createStockMovement(stockMovementRequest);
            log.info("Stock movement created successfully for receipt item: {}", receiptItem.getReceiptItemId());
        } catch (Exception e) {
            log.error("Failed to create stock movement for receipt item: {}", receiptItem.getReceiptItemId(), e);
            throw new AppException(ErrorCode.INVENTORY_UPDATE_FAILED);
        }
    }
    private String getOrCreateInventoryWarehouseId(ReceiptItem receiptItem) {
        // Tạo InventoryWarehouseRequest để tạo inventory warehouse entry
        InventoryWarehouseRequest inventoryRequest = InventoryWarehouseRequest.builder()
                .product(receiptItem.getImportItem().getProduct())
                .warehouse(receiptItem.getWarehouseReceipt().getImportOrder().getWarehouse())
                .bin(receiptItem.getBinLocation())
                .quantity(BigDecimal.ZERO)
                .expiryDate(receiptItem.getImportItem().getExpiredDate().toLocalDate())
                .status("AVAILABLE")
                .build();

        try {
            ApiResponse<InventoryWarehouseResponse> response = inventoryServiceClient.createInventoryWarehouse(inventoryRequest);
            return response.getResult().getInventoryWarehouseId();
        } catch (Exception e) {
            log.error("Failed to create inventory warehouse for receipt item: {}", receiptItem.getReceiptItemId(), e);
            throw new AppException(ErrorCode.INVENTORY_CREATION_FAILED);
        }
    }
    @Override
    public WarehouseReceiptResponse entry(WarehouseReceipt receipt) {
        // Async calls cho warehouse receipt
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(receipt.getImportOrder().getWarehouse());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(receipt.getCreatedByUser());

        CompletableFuture.allOf(warehouseFuture, userFuture).join();

        WarehouseReceiptResponse response = warehouseReceiptMapper.toResponse(receipt);

        // Populate ImportOrder
        ImportOrderResponse importOrderResponse = importOrderService.entry(receipt.getImportOrder());
        response.setImportOrder(importOrderResponse);
        response.setCreatedByUser(receipt.getCreatedByUser());
        response.setQuantityReceiveItem(receipt.getReceiptItems().size());
        // Populate ReceiptItems
//        List<ReceiptItemResponse> receiptItemResponses = receipt.getReceiptItems().stream()
//                .map(this::enrichReceiptItem)
//                .collect(Collectors.toList());
//        response.setReceiptItems(receiptItemResponses);

        return response;
    }

    private ReceiptItemResponse enrichReceiptItem(ReceiptItem receiptItem) {
        // Populate ImportItem với product details sử dụng existing service
        ImportResponseItem importItemResponse = importItemService.entry(receiptItem.getImportItem());

        ReceiptItemResponse response = receiptItemMapper.toResponse(receiptItem);
        response.setImportItem(importItemResponse);

        // Populate bin details nếu có
        if (receiptItem.getBinLocation() != null) {
            CompletableFuture<BinResponse> binFuture = asyncServiceImpl
                    .getBinAsync(receiptItem.getBinLocation());
            response.setBinDetails(binFuture.join());
        }

        return response;
    }
    @Override
    @Transactional
    public WarehouseReceiptResponse updateReceiptItem(String receiptId, String receiptItemId, ReceiptItemRequest request) {
        WarehouseReceipt receipt = getById(receiptId);

        if (receipt.getStatus() == ReceiptStatus.COMPLETED) {
            throw new AppException(ErrorCode.RECEIPT_ALREADY_COMPLETED);
        }

        // Find and update receipt item
        ReceiptItem receiptItem = receipt.getReceiptItems().stream()
                .filter(item -> item.getReceiptItemId().equals(receiptItemId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.RECEIPT_ITEM_NOT_FOUND));

        // Update receipt item
        receiptItem.setReceivedQuantity(request.getReceivedQuantity());
        receiptItem.setBinLocation(request.getBinLocation());
        receiptItem.setNote(request.getNote());
        receiptItem.setUpdatedAt(LocalDateTime.now());

        receiptItemRepo.save(receiptItem);

        // Sync with ImportOrderItem
        syncWithImportOrderItem(receiptItem);

        return entry(receipt);
    }

    private void syncWithImportOrderItem(ReceiptItem receiptItem) {
        try {
            // Update reality quantity in ImportOrderItem
            UpdateQuantityRequest quantityRequest = new UpdateQuantityRequest(receiptItem.getReceivedQuantity());
            importItemService.updateRealityQuantity(receiptItem.getImportItem().getItemId(), quantityRequest);

            // Update bin location in ImportOrderItem
            UpdateBinRequest binRequest = new UpdateBinRequest(receiptItem.getBinLocation());
            importItemService.updateBinLocation(receiptItem.getImportItem().getItemId(), binRequest);

            log.info("Synced receipt item {} with import order item {}",
                    receiptItem.getReceiptItemId(), receiptItem.getImportItem().getItemId());
        } catch (Exception e) {
            log.error("Failed to sync receipt item with import order item", e);
            throw new AppException(ErrorCode.SYNC_FAILED);
        }
    }
}