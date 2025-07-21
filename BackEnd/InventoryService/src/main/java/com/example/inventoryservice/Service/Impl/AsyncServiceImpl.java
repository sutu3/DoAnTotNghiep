package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Service.AsyncService;
import com.example.inventoryservice.Util.TokenContextHolder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AsyncServiceImpl implements AsyncService {

    ProductController productController;
    WarehouseController warehouseController;
    UserController userController;

    @Override
    public CompletableFuture<ProductResponse> getProductAsync(String productId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return productController.getProductById(productId).getResult();
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
    public CompletableFuture<BinResponse> getBinAsync(String binId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return warehouseController.getBinById(binId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });
    }

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
}