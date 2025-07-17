package com.example.order.Service.Impl;



import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Service.AsyncService;
import com.example.order.Utils.TokenContextHolder;
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
    WarehouseController warehouseController;
    UserController userController;
    ProductController productController;

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
    public CompletableFuture<UnitNameResponse> getUnitAsync(String unitId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return productController.getUnitById(unitId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });
    }
}
