package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Dto.Request.DeliveryItemRequest;
import com.example.order.Dto.Request.WarehouseDeliveryRequest;
import com.example.order.Dto.Response.DeliveryItem.DeliveryItemResponse;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Dto.Response.WarehouseDelivery.WarehouseDeliveryResponse;
import com.example.order.Enum.DeliveryStatus;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Mapper.DeliveryItemMapper;
import com.example.order.Mapper.WarehouseDeliveryMapper;
import com.example.order.Module.DeliveryItem;
import com.example.order.Module.ExportOrder;
import com.example.order.Module.WarehouseDelivery;
import com.example.order.Repo.DeliveryItemRepo;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Repo.Specification.WarehouseDeliverySpecification;
import com.example.order.Repo.WarehouseDeliveryRepo;
import com.example.order.Service.ExportItemService;
import com.example.order.Service.ExportOrderService;
import com.example.order.Service.WarehouseDeliveryService;
import com.example.order.Utils.ConvertToBaseUnit;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
public class WarehouseDeliveryServiceImpl implements WarehouseDeliveryService {

    WarehouseDeliveryRepo warehouseDeliveryRepo;
    DeliveryItemRepo deliveryItemRepo;
    ExportOrderRepo exportOrderRepo;
    MiddleWarehouseDeliveryAndExportItem middleWarehouseDeliveryAndExportItem;
    InventoryController inventoryController;
    WarehouseDeliveryMapper warehouseDeliveryMapper;
    DeliveryItemMapper deliveryItemMapper;
    ConvertToBaseUnit convertToBaseUnit;
    private final AsyncServiceImpl asyncServiceImpl;
    private final ExportOrderService exportOrderService;

    @Override
    @Transactional
    public WarehouseDeliveryResponse createDelivery(WarehouseDeliveryRequest request) {
        // Validate export order exists and has correct status
        ExportOrder exportOrder = exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(request.getExportOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_ORDER_NOT_FOUND));

        log.info("Creating delivery for export order: {}", exportOrder.getStatus());

        // Should validate APPROVED status, not COMPLETED
        if (exportOrder.getStatus() != ExportOrderStatus.APPROVED) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        // Create warehouse delivery with PENDING status
        WarehouseDelivery delivery = WarehouseDelivery.builder()
                .exportOrder(exportOrder)
                .createdByUser(GetCurrentUserId.getCurrentUserId())
                .deliveryDate(LocalDateTime.now())
                .status(DeliveryStatus.PENDING)  // Start with PENDING
                .warehouse(exportOrder.getWarehouse())
                .notes(request.getNotes())
                .isDeleted(false)
                .build();

        WarehouseDelivery savedDelivery = warehouseDeliveryRepo.save(delivery);

        // Create delivery items
        List<DeliveryItem> deliveryItems = request.getDeliveryItems().stream()
                .map(itemRequest -> DeliveryItem.builder()
                        .warehouseDelivery(savedDelivery)
                        .exportItem(middleWarehouseDeliveryAndExportItem.getById(itemRequest.getExportItemId()))
                        .deliveredQuantity(itemRequest.getDeliveredQuantity())
                        .binLocation(itemRequest.getBinLocation())
                        .note(itemRequest.getNote())
                        .deliveredAt(LocalDateTime.now())
                        .isDeleted(false)
                        .build())
                .collect(Collectors.toList());

        deliveryItemRepo.saveAll(deliveryItems);
        savedDelivery.setDeliveryItems(deliveryItems);

        // Update export order to IN_PROGRESS (not COMPLETED)
        exportOrder.setStatus(ExportOrderStatus.APPROVED);
        exportOrderRepo.save(exportOrder);

        // DO NOT call completeDelivery here - that should be separate API call

        return entry(savedDelivery);
    }

    @Override
    public WarehouseDelivery getById(String deliveryId) {
        return warehouseDeliveryRepo.findById(deliveryId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_NOT_FOUND));
    }

    @Override
    public WarehouseDeliveryResponse getByIdResponse(String deliveryId) {
        return entry(getById(deliveryId));
    }

    @Override
    public List<WarehouseDeliveryResponse> getByOrderId(String orderId) {
        return warehouseDeliveryRepo.findAllByExportOrder_ExportOrderIdAndIsDeleted(orderId, false)
                .stream()
                .map(this::entry)
                .collect(Collectors.toList());
    }

    @Override
    public Page<WarehouseDeliveryResponse> getByStatusAndWarehouse(String warehouseId, String status, Pageable pageable) {
        Specification<WarehouseDelivery> specification = Specification.where(WarehouseDeliverySpecification.hasWarehouse(warehouseId))
                .and(WarehouseDeliverySpecification.hasStatus(status));
        Page<WarehouseDelivery> deliveries = warehouseDeliveryRepo.findAll(specification, pageable);
        return deliveries.map(this::entry);
    }

    @Override
    public List<DeliveryItemResponse> getDeliveryItems(String deliveryId) {
        WarehouseDelivery delivery = getById(deliveryId);

        List<DeliveryItem> deliveryItems=delivery.getDeliveryItems();
        return deliveryItems.stream().map(this::enrichDeliveryItem).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WarehouseDeliveryResponse addDeliveryItem(String deliveryId, DeliveryItemRequest request) {
        WarehouseDelivery delivery = getById(deliveryId);

        if (delivery.getStatus() == DeliveryStatus.COMPLETED) {
            throw new AppException(ErrorCode.DELIVERY_ALREADY_COMPLETED);
        }

        DeliveryItem deliveryItem = DeliveryItem.builder()
                .warehouseDelivery(delivery)
                .exportItem(middleWarehouseDeliveryAndExportItem.getById(request.getExportItemId()))
                .deliveredQuantity(request.getDeliveredQuantity())
                .binLocation(request.getBinLocation())
                .note(request.getNote())
                .deliveredAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        deliveryItemRepo.save(deliveryItem);
        return entry(delivery);
    }

    @Override
    @Transactional
    public WarehouseDeliveryResponse updateDeliveryStatus(String deliveryId, DeliveryStatus status) {
        WarehouseDelivery delivery = getById(deliveryId);
        delivery.setStatus(status);
        delivery.setUpdatedAt(LocalDateTime.now());

        WarehouseDelivery savedDelivery = warehouseDeliveryRepo.save(delivery);
        return entry(savedDelivery);
    }

    @Override
    public List<WarehouseDeliveryResponse> getAllByWarehouseId(String warehouseId) {
        return warehouseDeliveryRepo.findAllByWarehouseAndIsDeleted(warehouseId, false)
                .stream()
                .map(this::entry)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WarehouseDeliveryResponse completeDelivery(String deliveryId) {
        WarehouseDelivery delivery = getById(deliveryId);

        if (delivery.getStatus() == DeliveryStatus.COMPLETED) {
            throw new AppException(ErrorCode.DELIVERY_ALREADY_COMPLETED);
        }

        try {
            // Process each delivery item
            List<DeliveryItem> deliveryItems = deliveryItemRepo
                    .findByWarehouseDelivery_DeliveryIdAndIsDeleted(deliveryId, false);

            for (DeliveryItem item : deliveryItems) {
                updateInventory(item);
            }

            // Update delivery status
            delivery.setStatus(DeliveryStatus.COMPLETED);
            delivery.setUpdatedAt(LocalDateTime.now());
            warehouseDeliveryRepo.save(delivery);

            // Update export order status
            ExportOrder exportOrder = delivery.getExportOrder();
            exportOrder.setStatus(ExportOrderStatus.COMPLETED);
            exportOrderRepo.save(exportOrder);
            return entry(delivery);
        } catch (Exception e) {
            log.error("Failed to complete delivery: {}", deliveryId, e);
            throw new AppException(ErrorCode.DELIVERY_COMPLETION_FAILED);
        }
    }

    @Override
    public WarehouseDeliveryResponse entry(WarehouseDelivery delivery) {
        try {
            // Parallel async calls for delivery-level data
            CompletableFuture<UserResponse> createdByUserFuture = asyncServiceImpl
                    .getUserAsync(delivery.getCreatedByUser());
            CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                    .getWarehouseAsync(delivery.getWarehouse());

            // Wait for delivery-level futures
            CompletableFuture.allOf(createdByUserFuture, warehouseFuture).join();

            // Build basic response
            WarehouseDeliveryResponse response = warehouseDeliveryMapper.toResponse(delivery);
            response.setWarehouse(warehouseFuture.join());
            // Set enriched delivery-level data
            response.setCreatedByUser(createdByUserFuture.join());

            // Enrich export order using existing service
            if (delivery.getExportOrder() != null) {
                ExportOrderResponse enrichedExportOrder = exportOrderService.entry(delivery.getExportOrder());
                response.setExportOrder(enrichedExportOrder);
            }

//            // Enrich delivery items in parallel
//            if (delivery.getDeliveryItems() != null && !delivery.getDeliveryItems().isEmpty()) {
//                List<DeliveryItemResponse> enrichedItems = delivery.getDeliveryItems().parallelStream()
//                        .map(this::enrichDeliveryItem)
//                        .collect(Collectors.toList());
//                response.setDeliveryItems(enrichedItems);
//            }

            return response;

        } catch (Exception e) {
            log.error("Failed to enrich warehouse delivery response for delivery: {}",
                    delivery.getDeliveryId(), e);
            // Fallback: return basic response without enrichment
            WarehouseDeliveryResponse fallbackResponse = warehouseDeliveryMapper.toResponse(delivery);
            if (delivery.getDeliveryItems() != null) {
                fallbackResponse.setDeliveryItems(
                        delivery.getDeliveryItems().stream()
                                .map(deliveryItemMapper::toResponse)
                                .collect(Collectors.toList())
                );
            }
            return fallbackResponse;
        }
    }

    private DeliveryItemResponse enrichDeliveryItem(DeliveryItem deliveryItem) {
        try {
            // Build enriched delivery item response
            DeliveryItemResponse response = deliveryItemMapper.toResponse(deliveryItem);

            // Enrich export item using existing service if available
            if (deliveryItem.getExportItem() != null) {
                ExportItemResponse enrichedExportItem = middleWarehouseDeliveryAndExportItem.entryExportItem(deliveryItem.getExportItem());
                response.setExportItem(enrichedExportItem);
            }

            // Enrich bin details if available
            if (deliveryItem.getBinLocation() != null && !deliveryItem.getBinLocation().isEmpty()) {
                CompletableFuture<BinResponse> binFuture = asyncServiceImpl
                        .getBinAsync(deliveryItem.getBinLocation());
                response.setBinDetails(binFuture.join());
            }

            return response;

        } catch (Exception e) {
            log.warn("Failed to enrich delivery item: {}, returning basic response",
                    deliveryItem.getDeliveryItemId(), e);
            return deliveryItemMapper.toResponse(deliveryItem);
        }
    }

    @Override
    @Transactional
    public WarehouseDeliveryResponse updateDeliveryItem(String deliveryId, String deliveryItemId, DeliveryItemRequest request) {
        WarehouseDelivery delivery = getById(deliveryId);

        if (delivery.getStatus() == DeliveryStatus.COMPLETED) {
            throw new AppException(ErrorCode.DELIVERY_ALREADY_COMPLETED);
        }

        DeliveryItem deliveryItem = deliveryItemRepo.findById(deliveryItemId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_ITEM_NOT_FOUND));

        deliveryItem.setDeliveredQuantity(request.getDeliveredQuantity());
        deliveryItem.setBinLocation(request.getBinLocation());
        deliveryItem.setNote(request.getNote());
        deliveryItem.setUpdatedAt(LocalDateTime.now());

        deliveryItemRepo.save(deliveryItem);
        return entry(delivery);
    }

    @Override
    @Transactional
    public void deleteDelivery(String deliveryId) {
        WarehouseDelivery delivery = getById(deliveryId);

        if (delivery.getStatus() == DeliveryStatus.COMPLETED) {
            throw new AppException(ErrorCode.CANNOT_DELETE_COMPLETED_DELIVERY);
        }

        delivery.setIsDeleted(true);
        delivery.setDeletedAt(LocalDateTime.now());
        warehouseDeliveryRepo.save(delivery);
    }

    @Override
    public WarehouseDelivery getByOrderId(String exportOrderId, Boolean isDeleted) {
        WarehouseDelivery warehouseDelivery=warehouseDeliveryRepo
                .findByExportOrder_ExportOrderIdAndIsDeleted(exportOrderId, isDeleted)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_ITEM_NOT_FOUND));
        return warehouseDelivery;
    }

    private void updateInventory(DeliveryItem deliveryItem) {
        // Create StockMovementRequest for export
        BigDecimal quantity = convertToBaseUnit.convertToBaseUnitPreciseDelivery(deliveryItem);
        log.info("Updating inventory for export with quantity: {}", quantity);

        StockMovementRequest stockMovementRequest = StockMovementRequest.builder()
                .product(deliveryItem.getExportItem().getProduct())
                .inventoryWarehouseId(getInventoryWarehouseId(deliveryItem))
                .movementType("EXPORT")
                .quantity(quantity.negate()) // Negative for export
                .unitCost(deliveryItem.getExportItem().getUnitPrice())
                .performedBy(deliveryItem.getWarehouseDelivery().getCreatedByUser())
                .referenceOrderId(deliveryItem.getExportItem().getExportOrder().getExportOrderId())
                .note("Xuất kho từ phiếu: " + deliveryItem.getWarehouseDelivery().getDeliveryId())
                .build();

        try {
            inventoryController.createStockMovement(stockMovementRequest);
            log.info("Stock movement created successfully for delivery item: {}", deliveryItem.getDeliveryItemId());
        } catch (Exception e) {
            log.error("Failed to create stock movement for delivery item: {}", deliveryItem.getDeliveryItemId(), e);
            throw new AppException(ErrorCode.INVENTORY_UPDATE_FAILED);
        }
    }

    private String getInventoryWarehouseId(DeliveryItem deliveryItem) {
        InventoryWarehouseResponse inventoryWarehouseResponse = inventoryController
                .getInventoryWarehouse(deliveryItem.getExportItem().getBinLocation()).getResult();
        return inventoryWarehouseResponse.getInventoryWarehouseId();
    }
}