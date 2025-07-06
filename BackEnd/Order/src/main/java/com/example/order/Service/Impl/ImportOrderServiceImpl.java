package com.example.order.Service.Impl;

import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Enum.OrderStatus;
import com.example.order.Enum.OrderType;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Mapper.ImportOrderMapper;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Service.ImportOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ImportOrderServiceImpl implements ImportOrderService {
    ImportOrderMapper importOrderMapper;
    UserController userController;
    WarehouseController warehouseController;
    ImportOrderRepo importOrderRepo;

    @Override
    public Page<ImportOrderResponse> getAllByWarehouse(String warehouse, Pageable pageable) {
        return importOrderRepo.findAllByWarehouseAndIsDeleted(warehouse,false,pageable)
                .map(importOrderMapper::toResponse);
    }

    @Override
    public ImportOrder getById(String id) {
        return importOrderRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND));
    }

    @Override
    public ImportOrderResponse getByIdResponse(String id) {
        return toResponse(getById(id));
    }

    @Override
    public Page<ImportOrderResponse> getAllByStatus(String warehouse, String status, Pageable pageable) {
        OrderStatus orderStatus = OrderStatus.valueOf(status);
        return importOrderRepo.findAllByWarehouseAndStatusAndIsDeleted(warehouse, orderStatus, false, pageable)
                .map(this::toResponse);
    }

    @Override
    public ImportOrderResponse createOrder(ImportOrderRequest importOrderRequest) {

        ImportOrder importOrder = importOrderMapper.toEntity(importOrderRequest);
        importOrder.setIsDeleted(false);
        importOrder.setStatus(OrderStatus.Created);
        importOrder.setRequestDate(LocalDateTime.now());
        importOrder.setCreatedAt(LocalDateTime.now());
        ImportOrder savedOrder = importOrderRepo.save(importOrder);
        return toResponse(savedOrder);
    }

    @Override
    public ImportOrderResponse updateOrder(ImportOrderForm update, String id) {
        ImportOrder importOrder = getById(id);
        importOrderMapper.toUpdate(importOrder, update);
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder updatedOrder = importOrderRepo.save(importOrder);
        return toResponse(updatedOrder);
    }

    @Override
    public ImportOrderResponse deleteOrder(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setIsDeleted(true);
        importOrder.setDeletedAt(LocalDateTime.now());
        importOrderRepo.save(importOrder);
        return toResponse(importOrder);
    }

    @Override
    public ImportOrderResponse updateStatus(String id, StatusForm status) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.valueOf(status.status()));
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder updatedOrder = importOrderRepo.save(importOrder);
        return toResponse(updatedOrder);
    }

    @Override
    public ImportOrderResponse updateApprove(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.InProgress);
        importOrder.setType(OrderType.Accept);
        importOrder.setAccessDate(LocalDateTime.now());
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder approvedOrder = importOrderRepo.save(importOrder);
        return toResponse(approvedOrder);
    }

    @Override
    public ImportOrderResponse updateReject(String id) {
        ImportOrder importOrder = getById(id);
        importOrder.setStatus(OrderStatus.Cancel);
        importOrder.setAccessDate(LocalDateTime.now());
        importOrder.setUpdatedAt(LocalDateTime.now());

        ImportOrder rejectedOrder = importOrderRepo.save(importOrder);
        return toResponse(rejectedOrder);
    }

    @Override
    public ImportOrderResponse toResponse(ImportOrder importOrder) {
        
        ImportOrderResponse importOrderResponse = importOrderMapper.toResponse(importOrder);
        UserResponse userResponse=userController
                .getUser(importOrder.getCreateByUser()).getResult();
        if(!importOrder.getAccessByAdmin().isEmpty()){
            UserResponse access=userController
                    .getUser(importOrder.getAccessByAdmin()).getResult();
            importOrderResponse.setAccessByAdmin(access);
        }
        WarehousesResponse warehouseResponse=warehouseController
                .getWarehouse(importOrder.getWarehouse()).getResult();
        importOrderResponse.setWarehouse(warehouseResponse);
        importOrderResponse.setCreateByUser(userResponse);
        return importOrderResponse;
    }
}
