package com.example.redisservice.Service.Impl;

import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.UserService.UserController;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.Client.WarehouseService.WarehouseController;
import com.example.redisservice.Service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheServiceImpl implements CacheService {

    private final UserController userServiceClient;
    private final WarehouseController warehouseServiceClient;

    @Override
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public UserResponse getUser(String userId) {
        log.info("Fetching user from UserService: {}", userId);
        return userServiceClient.getUser(userId).getResult();
    }

    @Override
    @Cacheable(value = "warehouses", key = "#warehouseId", unless = "#result == null")
    public WarehousesResponse getWarehouse(String warehouseId) {
        log.info("Fetching warehouse from WarehouseService: {}", warehouseId);
        return warehouseServiceClient.getWarehouse(warehouseId).getResult();
    }

    @Override
    @CacheEvict(value = "users", key = "#userId")
    public void evictUser(String userId) {
        log.info("Evicted user cache: {}", userId);
    }

    @Override
    @CacheEvict(value = "warehouses", key = "#warehouseId")
    public void evictWarehouse(String warehouseId) {
        log.info("Evicted warehouse cache: {}", warehouseId);
    }

    @Override
    @CacheEvict(value = {"users", "warehouses"}, allEntries = true)
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void evictAllCaches() {
        log.info("Evicted all caches");
    }
}
