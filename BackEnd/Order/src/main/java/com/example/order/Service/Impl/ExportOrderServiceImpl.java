package com.example.order.Service.Impl;

import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Dto.Request.ExportOrderRequest;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Mapper.ExportOrderMapper;
import com.example.order.Module.ExportOrder;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Service.ExportOrderService;
import com.example.order.Utils.DateUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ExportOrderServiceImpl implements ExportOrderService {
    ExportOrderRepo exportOrderRepo;
    ExportOrderMapper exportOrderMapper;
    AsyncServiceImpl asyncServiceImpl;

    @Override
    public ExportOrderResponse createExportOrder(ExportOrderRequest request) {
        ExportOrder exportOrder = ExportOrder.builder()
                .warehouse(request.warehouse())
                .createByUser(request.createByUser())
                .isDeleted(false)
                .customer(request.customer())
                .description(request.description())
                .deliveryDate( DateUtils.parseToLocalDateTime(request.deliveryDate().toString()).get())
                .status(ExportOrderStatus.CREATED)
                .build();
        ExportOrder savedOrder = exportOrderRepo.save(exportOrder);
        return entry(savedOrder);
    }

    @Override
    public ExportOrder getExportOrderById(String exportOrderId) {
        return exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(exportOrderId)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND));
    }

    @Override
    public ExportOrderResponse getExportOrderResponseById(String exportOrderId) {
        return exportOrderMapper.toResponse(getExportOrderById(exportOrderId));
    }

    @Override
    public Page<ExportOrderResponse> getAllExportOrders(Pageable pageable) {
        return exportOrderRepo.findAll(pageable)
                .map(this::entry);
    }

    @Override
    public Page<ExportOrderResponse> getExportOrdersByWarehouse(String warehouse, Pageable pageable) {
        return exportOrderRepo.findAllByWarehouseAndIsDeletedFalse(warehouse, pageable)
                .map(this::entry);    }

    @Override
    public Page<ExportOrderResponse> getExportOrdersByUser(String userId, Pageable pageable) {
        return exportOrderRepo.findAllByCreateByUserAndIsDeletedFalse(userId,pageable)
                .map(this::entry);
    }

    @Override
    public Page<ExportOrderResponse> getExportOrdersByStatus(ExportOrderStatus status, Pageable pageable) {
        return exportOrderRepo.findAllByStatusAndIsDeletedFalse(status,pageable)
                .map(this::entry);
    }

    @Override
    public Page<ExportOrderResponse> getExportOrdersByStatusAndWarehouse(ExportOrderStatus status, String warehouseId, Pageable pageable) {
        return exportOrderRepo.findAllByStatusAndIsDeletedFalseAndWarehouse(status,warehouseId,pageable)
                .map(this::entry);
    }

    @Override
    public ExportOrderResponse updateExportOrderStatus(String exportOrderId, ExportOrderStatus status) {
        ExportOrder exportOrder = exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(exportOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_ORDER_NOT_FOUND));
        String userId = GetCurrentUserId.getCurrentUserId();
        exportOrder.setStatus(status);
        exportOrder.setUpdatedAt(LocalDateTime.now());

        if (status == ExportOrderStatus.APPROVED) {
            exportOrder.setApprovedBy(userId);
            exportOrder.setApprovedDate(LocalDateTime.now());
        }

        ExportOrder updatedOrder = exportOrderRepo.save(exportOrder);
        return entry(updatedOrder);
    }

    @Override
    public ExportOrderResponse approveExportOrder(String exportOrderId) {
        return updateExportOrderStatus(exportOrderId, ExportOrderStatus.APPROVED);
    }

    @Override
    public void deleteExportOrder(String exportOrderId) {
        ExportOrder exportOrder = exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(exportOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_ORDER_NOT_FOUND));

        exportOrder.setIsDeleted(true);
        exportOrder.setDeletedAt(LocalDateTime.now());
        exportOrderRepo.save(exportOrder);
    }

    @Override
    public List<ExportOrderResponse> getExportOrdersForApproval() {
        List<ExportOrderStatus> pendingStatuses = Arrays.asList(
                ExportOrderStatus.CREATED,
                ExportOrderStatus.PENDING_APPROVAL
        );

        return exportOrderRepo.findByStatusInAndIsDeletedFalse(pendingStatuses)
                .stream()
                .map(this::entry)
                .toList();
    }

    @Override
    public Page<ExportOrderResponse> getExportOrdersForApprovalByWarehouse(String warehouse, Pageable pageable) {
        return exportOrderRepo.findAllByStatusAndWarehouseAndIsDeletedFalse(
                 ExportOrderStatus.PENDING_APPROVAL,warehouse,
                pageable).map(this::entry);
    }


    @Override
    public ExportOrderResponse entry(ExportOrder exportOrder) {
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(exportOrder.getWarehouse());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(exportOrder.getCreateByUser());

        CompletableFuture.allOf(warehouseFuture, userFuture).join();

        ExportOrderResponse exportOrderResponse = exportOrderMapper.toResponse(exportOrder);

        exportOrderResponse.setCreateByUser(userFuture.join());
        exportOrderResponse.setWarehouse(warehouseFuture.join());

        if(exportOrder.getApprovedBy() != null && !exportOrder.getApprovedBy().isEmpty()) {
            CompletableFuture<UserResponse> adminFuture = asyncServiceImpl
                    .getUserAsync(exportOrder.getApprovedBy());

            exportOrderResponse.setApprovedBy(adminFuture.join());
        }
        if(exportOrder.getCustomer() != null && !exportOrder.getCustomer().isEmpty()) {
            CompletableFuture<SupplierResponse> customerFuture = asyncServiceImpl
                    .getSupplierAsync(exportOrder.getCustomer());

            exportOrderResponse.setCustomer(customerFuture.join());
        }
        return exportOrderResponse;
    }
}
