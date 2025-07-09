package com.example.redisservice.Service.Impl;

import com.example.redisservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.redisservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.redisservice.Client.ProductService.ProductController;
import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.UserService.UserController;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
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
    private final ProductController productController;

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
    @Cacheable(value = "products", key = "#productId", unless = "#result == null")
    public ProductResponse getProduct(String productId) {
        log.info("Fetching Product from ProductService for ID: {}", productId);
        return productController.getProductById(productId).getResult();
    }

    @Override
    @Cacheable(value = "units", key = "#unitId", unless = "#result == null")
    public UnitNameResponse getUnit(String unitId) {
        log.info("Fetching Unit from ProductService for ID: {}", unitId);
        return productController.getUnitById(unitId).getResult();
    }

    @Override
    @Cacheable(value = "bins", key = "#binId", unless = "#result == null")
    public BinResponse getBin(String binId) {
        log.info("Fetching Bin from WarehouseService for ID: {}", binId);
        return warehouseController.getBinById(binId).getResult();            }

    @Override
    @CacheEvict(value = "bins", key = "#binId")
    public void evictBin(String binId) {
        log.info("Evicting bin cache for ID: {}", binId);
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
    @CacheEvict(value = "product", key = "#productId")
    public void evictProduct(String productId) {
        log.info("Evicting product cache for ID: {}", productId);
    }

    @Override
    @CacheEvict(value = "unit", key = "#unitId")
    public void evictUnit(String unitId) {
        log.info("Evicting unit cache for ID: {}", unitId);
    }

    @Override
    @CacheEvict(value = {"users", "warehouses"}, allEntries = true)
    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void evictAllCaches() {
        log.info("Evicting all caches");
    }
}
