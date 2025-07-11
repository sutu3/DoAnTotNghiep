package com.example.inventoryservice.Controller;


import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Response.InventoryStatsResponse;
import com.example.inventoryservice.Dtos.Response.SuggestedLocationStats;
import com.example.inventoryservice.Dtos.Response.WarehouseCapacityStats;
import com.example.inventoryservice.Service.InventoryStatsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/stats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Inventory Statistics API", description = "Thống kê tồn kho và dashboard")
public class InventoryStatsController {

    InventoryStatsService inventoryStatsService;

    /**
     * Lấy thống kê chi tiết của một sản phẩm trong warehouse
     * @param productId ID của sản phẩm
     * @param warehouseId ID của warehouse
     * @return InventoryStatsResponse - Thống kê chi tiết bao gồm tồn kho, capacity, suppliers
     */
    @GetMapping("/product/{productId}/warehouse/{warehouseId}")
    public ApiResponse<InventoryStatsResponse> getProductInventoryStats(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<InventoryStatsResponse>builder()
                .Result(inventoryStatsService.getProductInventoryStats(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy thống kê tổng quan warehouse capacity
     * @param warehouseId ID của warehouse
     * @return WarehouseCapacityStats - Thống kê sức chứa kho
     */
    @GetMapping("/warehouse/{warehouseId}/capacity")
    public ApiResponse<WarehouseCapacityStats> getWarehouseCapacityStats(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<WarehouseCapacityStats>builder()
                .Result(inventoryStatsService.getWarehouseCapacityStats(warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy danh sách vị trí đề xuất cho sản phẩm
     * @param productId ID của sản phẩm
     * @param warehouseId ID của warehouse
     * @return List<SuggestedLocationStats> - Danh sách vị trí đề xuất
     */
    @GetMapping("/product/{productId}/warehouse/{warehouseId}/suggested-locations")
    public ApiResponse<List<SuggestedLocationStats>> getSuggestedLocations(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<SuggestedLocationStats>>builder()
                .Result(inventoryStatsService.getSuggestedLocations(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
