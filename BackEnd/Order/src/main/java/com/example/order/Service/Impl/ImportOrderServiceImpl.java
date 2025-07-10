package com.example.order.Service.Impl;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItemNoList;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Enum.OrderStatus;
import com.example.order.Enum.OrderType;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Mapper.ImportItemMapper;
import com.example.order.Mapper.ImportOrderMapper;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportItemRepo;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Service.ImportItemService;
import com.example.order.Service.ImportOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        return importOrderRepo.findAllByWarehouseAndStatusAndIsDeleted(warehouse, orderStatus, false, pageable)
                .map(this::entry);
    }

    @Override
    public ImportOrderResponse createOrder(ImportOrderRequest importOrderRequest) {
        log.info("Create Order Request1:{}",importOrderRequest);
        ImportOrder importOrder = importOrderMapper.toEntity(importOrderRequest);
        log.info("Create Order Request2:{}",importOrder);
        importOrder.setIsDeleted(false);
        importOrder.setType(OrderType.Request);
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
    public ImportOrderResponse updateReject(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.Cancel);
        importOrder.setAccessDate(LocalDateTime.now());
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder rejectedOrder = importOrderRepo.save(importOrder);
        return entry(rejectedOrder);
    }

    @Override
    public ImportOrderResponse entry(ImportOrder importOrder) {
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(importOrder.getWarehouse());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(importOrder.getCreateByUser());
        CompletableFuture.allOf(warehouseFuture, userFuture).join();

        ImportOrderResponse importOrderResponse = importOrderMapper.toResponse(importOrder);
        if (importOrder.getAccessByAdmin() != null && !importOrder.getAccessByAdmin().isEmpty()) {
            UserResponse access = userController
                    .getUser(importOrder.getAccessByAdmin()).getResult();
            importOrderResponse.setAccessByAdmin(access);
        }
        importOrderResponse.setItemCount(importItemRepo.countByImportOrder_ImportOrderIdAndIsDeleted(importOrder.getImportOrderId(),false));
        importOrderResponse.setWarehouse(warehouseFuture.join());
        importOrderResponse.setCreateByUser(userFuture.join());

        return importOrderResponse;
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
}
