package com.example.inventoryservice.Client.OrderService;

import com.example.inventoryservice.Client.OrderService.Dtos.Response.ExportOrderResponse;
import com.example.inventoryservice.Client.OrderService.Dtos.Response.ImportOrderResponse;
import com.example.inventoryservice.Client.OrderService.Fallbacks.OrderServiceFallback;
import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "order-service",
        //url = "https://orderservice-3u1b.onrender.com",
        url = "http://localhost:8085",
        fallback = OrderServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface OrderController {
    @GetMapping(value = "/api/importItems/recent-suppliers/product/{productId}/warehouse/{warehouseId}", consumes = "application/json")
    ApiResponse<List<String>> getRecentSuppliersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );

    @GetMapping(value = "/api/importOrders/pending-orders/product/{productId}/warehouse/{warehouseId}", consumes = "application/json")
    ApiResponse<Integer> getPendingOrdersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );
    @GetMapping("/api/importOrders/search/warehouse/{warehouseId}/date-range")
    ApiResponse<List<ImportOrderResponse>> getOrdersByWarehouseAndDateRange(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    );

    @GetMapping("/api/exportOrders/search/warehouse/{warehouseId}/date-range")
    ApiResponse<List<ExportOrderResponse>> getExportOrdersByWarehouseAndDateRange(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    );

    @GetMapping("/api/importOrders/search/warehouse/{warehouseId}/status/pending")
    ApiResponse<List<ImportOrderResponse>> getPendingImportOrdersByWarehouse(
            @PathVariable String warehouseId
    );

    @GetMapping("/api/exportOrders/search/warehouse/{warehouseId}/status/pending")
    ApiResponse<List<ExportOrderResponse>> getPendingExportOrdersByWarehouse(
            @PathVariable String warehouseId
    );

    @GetMapping("/api/importOrders/search/warehouse/{warehouseId}/status/completed/date-range")
    ApiResponse<List<ImportOrderResponse>> getCompletedImportOrdersByWarehouse(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    );

    @GetMapping("/api/exportOrders/search/warehouse/{warehouseId}/status/completed/date-range")
    ApiResponse<List<ExportOrderResponse>> getCompletedExportOrdersByWarehouse(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    );

}
