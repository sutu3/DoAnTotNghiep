package com.example.redisservice.controller;

import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Service.CacheService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Cache API", description = "Redis Cache Management")
public class CacheController {

    CacheService cacheService;

    @GetMapping("/users/{userId}")
    public ApiResponse<UserResponse> getCachedUser(@PathVariable String userId) {
        return ApiResponse.<UserResponse>builder()
                .Result(cacheService.getUser(userId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/suppliers/{supplierId}")
    public ApiResponse<SupplierResponse> getCachedSupplier(@PathVariable String supplierId) {
        return ApiResponse.<SupplierResponse>builder()
                .Result(cacheService.getSupplier(supplierId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/warehouses/{warehouseId}")
    public ApiResponse<WarehousesResponse> getCachedWarehouse(@PathVariable String warehouseId) {
        return ApiResponse.<WarehousesResponse>builder()
                .Result(cacheService.getWarehouse(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<String> evictUser(@PathVariable String userId) {
        cacheService.evictUser(userId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
                .code(0)
                .message("Success  ")
                .success(true)
                .build();
    }
}