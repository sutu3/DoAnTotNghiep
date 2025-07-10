package com.example.redisservice.Service;

import com.example.redisservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.redisservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.DTOs.Response.ApiResponse;

import java.util.List;

public interface CacheService {
    UserResponse getUser(String userId);
    SupplierResponse getSupplier(String supplierId);
    WarehousesResponse getWarehouse(String warehouseId);
    ProductResponse getProduct(String productId);
    UnitNameResponse getUnit(String unitId);
    BinResponse getBin(String binId);
    List<BinResponse> getAllListBinByWarehouseId(String warehouseId);
    void evictBin(String binId);
    void evictUser(String userId);
    void evictWarehouse(String warehouseId);
    void evictProduct(String productId);
    void evictUnit(String unitId);
    void evictSupplier(String supplierId);
    void evictAllCaches();
}