package com.example.inventoryservice.Service;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;

import java.util.concurrent.CompletableFuture;

public interface AsyncService {
    CompletableFuture<ProductResponse> getProductAsync(String productId);
    CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId);
    CompletableFuture<BinResponse> getBinAsync(String binId);
    CompletableFuture<UserResponse> getUserAsync(String userId);
}
