package com.example.inventoryservice.Controller;

import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Response.DashboardStatsResponse;
import com.example.inventoryservice.Service.DashboardStatsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard/stats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Dashboard Statistics API", description = "Thống kê dashboard theo thời gian")
public class DashboardStatsController {

    DashboardStatsService dashboardStatsService;

//    @GetMapping("/warehouse/{warehouseId}")
//    public ApiResponse<DashboardStatsResponse> getDashboardStats(
//            @PathVariable String warehouseId,
//            @RequestParam(defaultValue = "today") String timeFilter
//    ) {
//        return ApiResponse.<DashboardStatsResponse>builder()
//                .Result(dashboardStatsService.getDashboardStats(warehouseId, timeFilter))
//                .code(0)
//                .message("Success")
//                .success(true)
//                .build();
//    }
    @GetMapping("/warehouse/{warehouseId}")
    public ApiResponse<DashboardStatsResponse> getWarehouseStats(
            @PathVariable String warehouseId,
            @RequestParam(defaultValue = "today") String timeFilter
    ) {
        return ApiResponse.<DashboardStatsResponse>builder()
                .Result(dashboardStatsService.getWarehouseStats(warehouseId, timeFilter))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<DashboardStatsResponse> getAllWarehousesStats(
            @RequestParam(defaultValue = "today") String timeFilter
    ) {
        return ApiResponse.<DashboardStatsResponse>builder()
                .Result(dashboardStatsService.getAllWarehousesStats(timeFilter))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
}
