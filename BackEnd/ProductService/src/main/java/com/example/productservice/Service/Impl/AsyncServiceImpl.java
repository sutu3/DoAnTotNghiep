package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Service.AsyncService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class AsyncServiceImpl implements AsyncService {
    UserController  userController;
    WarehouseController warehouseController;
    @Override
    public CompletableFuture<UserResponse> getUserAsync(String userId) {
        return CompletableFuture.supplyAsync(() -> userController.getUser(userId).getResult());

    }

    @Override
    public CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId) {
        return CompletableFuture.supplyAsync(() -> warehouseController.getWarehouse(warehouseId).getResult());
    }

    @Override
    public CompletableFuture<SupplierResponse> getSupplierAsync(String supplierId) {
        return CompletableFuture.supplyAsync(() -> userController.getSupplier(supplierId).getResult());
    }
}
