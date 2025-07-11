package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Service.AsyncService;
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
        return CompletableFuture.supplyAsync(() -> productController.getProductById(productId).getResult());
    }

    @Override
    public CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId) {
        return CompletableFuture.supplyAsync(() -> warehouseController.getWarehouse(warehouseId).getResult());
    }

    @Override
    public CompletableFuture<BinResponse> getBinAsync(String binId) {
        return CompletableFuture.supplyAsync(() -> warehouseController.getBinById(binId).getResult());
    }

    @Override
    public CompletableFuture<UserResponse> getUserAsync(String userId) {
        return CompletableFuture.supplyAsync(() -> userController.getUser(userId).getResult());
    }
}