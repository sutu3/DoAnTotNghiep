package com.example.order.Service.Impl;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponseClient;
import com.example.order.Dto.Response.ReceiptItem.ReceiptItemResponse;
import com.example.order.Enum.OrderStatus;
import com.example.order.Enum.OrderType;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Mapper.ImportItemMapper;
import com.example.order.Mapper.ImportOrderMapper;
import com.example.order.Module.ImportItem;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportItemRepo;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Repo.Specification.ImportOrderSpecification;
import com.example.order.Service.ImportItemService;
import com.example.order.Service.ImportOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ImportOrderServiceImpl implements ImportOrderService {
    private final ImportItemMapper importItemMapper;
    ImportOrderMapper importOrderMapper;
    UserController userController;
    ImportOrderRepo importOrderRepo;
    AsyncServiceImpl asyncServiceImpl;
    private final ImportItemRepo importItemRepo;

    @Override
    public Page<ImportOrderResponse> getAllByWarehouse(String warehouse, Pageable pageable) {
        return importOrderRepo.findAllByWarehouseAndIsDeleted(warehouse,false,pageable)
                .map(this::entry);
    }

    @Override
    public ImportOrder getById(String id) {
        return importOrderRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND));
    }

    @Override
    public ImportOrderResponse getByIdResponse(String id) {
        return entry(getById(id));
    }

    @Override
    public Page<ImportOrderResponse> getAllByStatus(String warehouse, String status, Pageable pageable) {
        Specification<ImportOrder> specification = Specification.where(ImportOrderSpecification.hasWarehouse(warehouse))
                .and(ImportOrderSpecification.hasStatus(status));
        Page<ImportOrder> importOrders = importOrderRepo.findAll(specification, pageable);
        return importOrders.map(this::entry);
    }

    @Override
    public ImportOrderResponse createOrder(ImportOrderRequest importOrderRequest) {
        log.info("Create Order Request1:{}",importOrderRequest);
        ImportOrder importOrder = importOrderMapper.toEntity(importOrderRequest);
        log.info("Create Order Request2:{}",importOrder);
        var idUser=GetCurrentUserId.getCurrentUserId();
        importOrder.setIsDeleted(false);
        importOrder.setType(OrderType.Request);
        importOrder.setCreateByUser(idUser);
        importOrder.setStatus(OrderStatus.Created);
        importOrder.setRequestDate(LocalDateTime.now());
        importOrder.setCreatedAt(LocalDateTime.now());
        ImportOrder savedOrder = importOrderRepo.save(importOrder);
        return entry(savedOrder);
    }

    @Override
    public ImportOrderResponse updateOrder(ImportOrderForm update, String id) {
        ImportOrder importOrder = getById(id);
        importOrderMapper.toUpdate(importOrder, update);
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder updatedOrder = importOrderRepo.save(importOrder);
        return entry(updatedOrder);
    }

    @Override
    public ImportOrderResponse deleteOrder(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setIsDeleted(true);
        importOrder.setDeletedAt(LocalDateTime.now());
        ImportOrder importOrderSave=importOrderRepo.save(importOrder);
        return entry(importOrderSave);
    }

    @Override
    public ImportOrderResponse updateStatus(String id, StatusForm status) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.valueOf(status.status()));
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder updatedOrder = importOrderRepo.save(importOrder);
        return entry(updatedOrder);
    }

    @Override
    public ImportOrderResponse updateApprove(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.InProgress);
        importOrder.setType(OrderType.Accept);
        importOrder.setAccessDate(LocalDateTime.now());
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder approvedOrder = importOrderRepo.save(importOrder);
        return entry(approvedOrder);
    }

    @Override
    public ImportOrderResponse updateReject(String id,ImportOrderForm form) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.Cancel);
        importOrder.setAccessDate(LocalDateTime.now());
        importOrder.setUpdatedAt(LocalDateTime.now());
        importOrder.setNote(importOrder.getNote()+"   Reason:"+form.note());
        ImportOrder rejectedOrder = importOrderRepo.save(importOrder);
        return entry(rejectedOrder);
    }

    @Override
    public ImportOrderResponse entry(ImportOrder importOrder) {
        try {
            // Parallel async calls for required data
            CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                    .getWarehouseAsync(importOrder.getWarehouse());
            CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                    .getUserAsync(importOrder.getCreateByUser());

            // Optional async call for admin access
            CompletableFuture<UserResponse> adminFuture = null;
            if (importOrder.getAccessByAdmin() != null && !importOrder.getAccessByAdmin().isEmpty()) {
                adminFuture = asyncServiceImpl.getUserAsync(importOrder.getAccessByAdmin());
            }

            // Wait for all required futures
            CompletableFuture<Void> allRequiredFutures = CompletableFuture.allOf(warehouseFuture, userFuture);
            if (adminFuture != null) {
                allRequiredFutures = CompletableFuture.allOf(warehouseFuture, userFuture, adminFuture);
            }
            allRequiredFutures.join();

            // Build response
            ImportOrderResponse importOrderResponse = importOrderMapper.toResponse(importOrder);

            // Set enriched data
            importOrderResponse.setWarehouse(warehouseFuture.join());
            importOrderResponse.setCreateByUser(userFuture.join());

            List<ImportResponseItem> itemResponse = importOrder.getImportItems().stream()
                    .map(this::entryOrderItem)
                    .collect(Collectors.toList());
            importOrderResponse.setImportItems(itemResponse);
            if (adminFuture != null) {
                importOrderResponse.setAccessByAdmin(adminFuture.join());
            }
            // Set item count
            importOrderResponse.setItemCount(
                    importItemRepo.countByImportOrder_ImportOrderIdAndIsDeleted(
                            importOrder.getImportOrderId(), false
                    )
            );

            return importOrderResponse;

        } catch (Exception e) {
            log.error("Failed to enrich import order response for order: {}",
                    importOrder.getImportOrderId(), e);
            // Fallback: return basic response without enrichment
            return importOrderMapper.toResponse(importOrder);
        }
    }
    @Override
    public ImportResponseItem entryOrderItem(ImportItem importItem) {
        try {
            // Parallel async calls for required data
            CompletableFuture<UnitNameResponse> unitFuture = asyncServiceImpl
                    .getUnitAsync(importItem.getUnit());
            CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                    .getProductAsync(importItem.getProduct());
            CompletableFuture<SupplierResponse> supplierFuture = asyncServiceImpl
                    .getSupplierAsync(importItem.getSupplier());
            CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                    .getUserAsync(importItem.getCreateByUser());

            // Optional async call for bin
            CompletableFuture<BinResponse> binFuture = null;
            if (importItem.getBin() != null && !importItem.getBin().isEmpty()) {
                binFuture = asyncServiceImpl.getBinAsync(importItem.getBin());
            }

            // Wait for all required futures
            CompletableFuture<Void> allRequiredFutures = CompletableFuture.allOf(
                    unitFuture, productFuture, supplierFuture, userFuture
            );

            if (binFuture != null) {
                allRequiredFutures = CompletableFuture.allOf(
                        unitFuture, productFuture, supplierFuture, userFuture, binFuture
                );
            }
            allRequiredFutures.join();

            // Build response
            ImportResponseItem importResponseItem = importItemMapper.toResponse(importItem);

            // Set enriched data
            importResponseItem.setUnit(unitFuture.join());
            importResponseItem.setProduct(productFuture.join());
            importResponseItem.setSupplier(supplierFuture.join());
            importResponseItem.setCreateByUser(userFuture.join());

            if (binFuture != null) {
                importResponseItem.setBin(binFuture.join());
            }

            return importResponseItem;

        } catch (Exception e) {
            log.error("Failed to enrich import item response for item: {}",
                    importItem.getItemId(), e);
            // Fallback: return basic response without enrichment
            return importItemMapper.toResponse(importItem);
        }
    }

    @Override
    public Integer getPendingOrdersByProduct(String productId, String warehouseId) {
        // Lấy tất cả orders có status Created hoặc InProgress trong warehouse
        List<OrderStatus> pendingStatuses = Arrays.asList(OrderStatus.Created, OrderStatus.InProgress);

        // Query để đếm số lượng items đang pending cho product cụ thể
        return importItemRepo.countPendingItemsByProductAndWarehouse(
                productId, warehouseId, pendingStatuses, false
        );
    }

    @Override
    public List<ImportOrderResponseClient> getOrdersByWarehouseAndDateRange(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        List<ImportOrder> orders = importOrderRepo.findAllByWarehouseAndCreatedAtBetweenAndIsDeleted(
                warehouseId, fromDate, toDate, false);
        return orders.stream()
                .map(importOrderMapper::toClient)
                .collect(Collectors.toList());
    }

    @Override
    public List<ImportOrderResponseClient> getPendingImportOrdersByWarehouse(String warehouseId) {
        List<OrderStatus> pendingStatuses = Arrays.asList(OrderStatus.Created, OrderStatus.InProgress);
        List<ImportOrder> orders = importOrderRepo.findAllByWarehouseAndStatusInAndIsDeleted(
                warehouseId, pendingStatuses, false);
        return orders.stream()
                .map(importOrderMapper::toClient)
                .collect(Collectors.toList());
    }

    @Override
    public List<ImportOrderResponseClient> getCompletedImportOrdersByWarehouse(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        List<ImportOrder> orders = importOrderRepo.findAllByWarehouseAndStatusAndCreatedAtBetweenAndIsDeleted(
                warehouseId, OrderStatus.Done, fromDate, toDate, false);
        return orders.stream()
                .map(importOrderMapper::toClient)
                .collect(Collectors.toList());
    }

    @Override
    public ImportOrderResponse markGoodsArrived(String orderId) {
        ImportOrder importOrder = getById(orderId);

        // Thay đổi validation - chấp nhận từ InProgress thay vì Sent_To_Supplier
        if (importOrder.getStatus() != OrderStatus.InProgress) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        importOrder.setStatus(OrderStatus.Goods_Arrived);
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder savedOrder = importOrderRepo.save(importOrder);
        return entry(savedOrder);
    }

    @Override
    public List<ImportOrderResponse> getOrdersReadyForReceipt(String warehouseId) {
        List<ImportOrder> orders = importOrderRepo.findAllByWarehouseAndStatusAndIsDeleted(
                warehouseId, OrderStatus.Goods_Arrived, false);
        return orders.stream()
                .map(this::entry)
                .collect(Collectors.toList());
    }
    @Override
    public Integer getApprovedOrdersByProduct(String productId, String warehouseId) {
        log.info("Giá trị sản phẩm nhập dự kiến"+importItemRepo.countApprovedItemsByProductAndWarehouse(
                productId, warehouseId, false));
        return importItemRepo.countApprovedItemsByProductAndWarehouse(
                productId, warehouseId, false
        );
    }
}
