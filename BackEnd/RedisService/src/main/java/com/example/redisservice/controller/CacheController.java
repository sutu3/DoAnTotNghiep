package com.example.redisservice.controller;

import com.example.redisservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.redisservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Service.CacheService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/products/{productId}")
    public ApiResponse<ProductResponse> getCachedProduct(@PathVariable String productId) {
        return ApiResponse.<ProductResponse>builder()
                .Result(cacheService.getProduct(productId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/units/{unitId}")
    public ApiResponse<UnitNameResponse> getCachedUnit(@PathVariable String unitId) {
        return ApiResponse.<UnitNameResponse>builder()
                .Result(cacheService.getUnit(unitId))
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
    @GetMapping("/bins/{binId}")
    public ApiResponse<BinResponse> getCachedBin(@PathVariable String binId) {
        return ApiResponse.<BinResponse>builder()
                .Result(cacheService.getBin(binId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/bins/byWarehouse/{warehouseId}/list")
    public ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(@PathVariable String warehouseId){
        return ApiResponse.<List<BinResponse>>builder()
                .Result(cacheService.getAllListBinByWarehouseId(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @DeleteMapping("/bins/{userId}")
    public ApiResponse<String> evictBin(@PathVariable String binId) {
        cacheService.evictBin(binId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
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
                .message("Success")
                .success(true)
                .build();
    }
    @DeleteMapping("/products/{productId}")
    public ApiResponse<String> evictProduct(@PathVariable String productId) {
        cacheService.evictProduct(productId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @DeleteMapping("/units/{unitId}")
    public ApiResponse<String> evictUnit(@PathVariable String unitId) {
        cacheService.evictUnit(unitId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @DeleteMapping("/suppliers/{supplierId}")
    public ApiResponse<String> evictSupplier(@PathVariable String supplierId) {
        cacheService.evictSupplier(supplierId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @DeleteMapping("/warehouses/{warehousesId}")
    public ApiResponse<String> evictWarehouse(@PathVariable String warehousesId) {
        cacheService.evictWarehouse(warehousesId);
        return ApiResponse.<String>builder()
                .Result("Cache evicted")
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
}