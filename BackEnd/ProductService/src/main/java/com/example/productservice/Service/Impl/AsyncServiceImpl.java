package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Service.AsyncService;
import com.example.productservice.Util.TokenContextHolder;
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
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return userController.getUser(userId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });

    }

    @Override
    public CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return warehouseController.getWarehouse(warehouseId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });
    }

    @Override
    public CompletableFuture<SupplierResponse> getSupplierAsync(String supplierId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return userController.getSupplier(supplierId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });
    }
}
