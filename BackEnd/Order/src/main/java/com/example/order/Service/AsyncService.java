package com.example.order.Service;


import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public interface AsyncService {
    CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId);
    CompletableFuture<BinResponse> getBinAsync(String binId);
    CompletableFuture<UserResponse> getUserAsync(String userId);
    CompletableFuture<SupplierResponse> getSupplierAsync(String supplierId);
    CompletableFuture<ProductResponse> getProductAsync(String productId);
    CompletableFuture<UnitNameResponse> getUnitAsync(String unitId);

}
