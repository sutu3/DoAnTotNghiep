package com.example.redisservice.Service.Impl;

import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.UserService.UserController;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.Client.WarehouseService.WarehouseController;
import com.example.redisservice.Service.CacheService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CacheServiceImpl implements CacheService {

    UserController userController;
    WarehouseController warehouseController;

    @Override
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public UserResponse getUser(String userId) {
        log.info("Fetching user from UserService for ID: {}", userId);
        return userController.getUser(userId).getResult();
    }
    @Override
    @Cacheable(value = "suppliers", key = "#supplierId", unless = "#result == null")
    public SupplierResponse getSupplier(String supplierId) {
        log.info("Fetching supplier from UserService for ID: {}", supplierId);
        return userController.getSupplier(supplierId).getResult();
    }


    @Override
    @Cacheable(value = "warehouses", key = "#warehouseId", unless = "#result == null")
    public WarehousesResponse getWarehouse(String warehouseId) {
        log.info("Fetching warehouse from WarehouseService for ID: {}", warehouseId);
        return warehouseController.getWarehouse(warehouseId).getResult();
    }

    @Override
    @CacheEvict(value = "users", key = "#userId")
    public void evictUser(String userId) {
        log.info("Evicting user cache for ID: {}", userId);
    }
    @Override
    @CacheEvict(value = "suppliers", key = "#supplierId")
    public void evictSupplier(String supplierId) {
        log.info("Evicting supplier cache for ID: {}", supplierId);
    }

    @Override
    @CacheEvict(value = "warehouses", key = "#warehouseId")
    public void evictWarehouse(String warehouseId) {
        log.info("Evicting warehouse cache for ID: {}", warehouseId);
    }

    @Override
    @CacheEvict(value = {"users", "warehouses"}, allEntries = true)
    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void evictAllCaches() {
        log.info("Evicting all caches");
    }
}
