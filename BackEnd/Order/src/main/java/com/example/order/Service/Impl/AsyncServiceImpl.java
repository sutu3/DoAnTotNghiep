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
    WarehouseController warehouseController;
    private final UserController userController;
    private final ProductController productController;


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

    @Override
    public CompletableFuture<SupplierResponse> getSupplierAsync(String supplierId) {
        return CompletableFuture.supplyAsync(() -> userController.getSupplier(supplierId).getResult());
    }

    @Override
    public CompletableFuture<ProductResponse> getProductAsync(String productId) {
        return CompletableFuture.supplyAsync(() -> productController.getProductById(productId).getResult());
    }

    @Override
    public CompletableFuture<UnitNameResponse> getUnitAsync(String unitId) {
        return CompletableFuture.supplyAsync(() -> productController.getUnitById(unitId).getResult());
    }


}
