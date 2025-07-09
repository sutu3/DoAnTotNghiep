package com.example.productservice.Service;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
@Service

public interface AsyncService {
    CompletableFuture<UserResponse> getUserAsync(String userId);
    CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId);
    CompletableFuture<SupplierResponse> getSupplierAsync(String supplierId);
}
