package com.example.redisservice.controller;

import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Service.CacheService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
@Tag(name = "Cache API", description = "Redis Cache Management")
public class CacheController {

    private final CacheService cacheService;

    @GetMapping("/users/{userId}")
    public ApiResponse<UserResponse> getCachedUser(@PathVariable String userId) {
        return ApiResponse.<UserResponse>builder()
                .Result(cacheService.getUser(userId))
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