package com.example.redisservice.Service;

import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;

public interface CacheService {
    UserResponse getUser(String userId);
    WarehousesResponse getWarehouse(String warehouseId);
    void evictUser(String userId);
    void evictWarehouse(String warehouseId);
    void evictAllCaches();
}