package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.OrderService.OrderController;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Client.UserService.UserClient;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Client.WarehouseService.WarehouseClient;
import com.example.inventoryservice.Dtos.Response.DashboardStatsResponse;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Repo.InventoryWarehouseRepo;
import com.example.inventoryservice.Service.DashboardStatsService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DashboardStatsServiceImpl implements DashboardStatsService {

    InventoryProductRepo inventoryProductRepo;
    InventoryWarehouseRepo inventoryWarehouseRepo;
    OrderController orderController;
    UserController userController;
    WarehouseController warehouseController;

    UserClient userClient;
    WarehouseClient warehouseClient;

    @Override
    public DashboardStatsResponse getWarehouseStats(String warehouseId, String timeFilter) {
        DateRange dateRange = calculateDateRange(timeFilter);

        // Sử dụng các helper methods đã có
        CompletableFuture<Integer> totalOrdersFuture = CompletableFuture.supplyAsync(() ->
                getTotalOrders(warehouseId, dateRange));

        CompletableFuture<BigDecimal> inventoryValueFuture = CompletableFuture.supplyAsync(() ->
                getTotalInventoryValue(warehouseId));

        CompletableFuture<Integer> totalProductsFuture = CompletableFuture.supplyAsync(() ->
                getTotalProducts(warehouseId));

        CompletableFuture<Integer> lowStockItemsFuture = CompletableFuture.supplyAsync(() ->
                getLowStockItems(warehouseId));

        CompletableFuture<Integer> warehouseCapacityFuture = CompletableFuture.supplyAsync(() ->
                getWarehouseCapacity(warehouseId));

        CompletableFuture<Integer> activeUsersFuture = CompletableFuture.supplyAsync(() ->
                getActiveUsers(warehouseId));

        // Chờ tất cả futures hoàn thành
        CompletableFuture.allOf(totalOrdersFuture, inventoryValueFuture,
                totalProductsFuture, lowStockItemsFuture,
                warehouseCapacityFuture, activeUsersFuture).join();

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrdersFuture.join())
                .totalInventoryValue(inventoryValueFuture.join())
                .totalProducts(totalProductsFuture.join())
                .lowStockItems(lowStockItemsFuture.join())
                .warehouseCapacity(warehouseCapacityFuture.join())
                .activeUsers(activeUsersFuture.join())
                .timeFilter(timeFilter)
                .fromDate(LocalDateTime.parse(dateRange.getFromDate().toString()))
                .toDate(LocalDateTime.parse(dateRange.getToDate().toString()))
                .build();
    }

    @Override
    public DashboardStatsResponse getAllWarehousesStats(String timeFilter) {
        DateRange dateRange = calculateDateRange(timeFilter);

        // Thống kê tổng hợp tất cả warehouse
        CompletableFuture<Integer> totalOrdersFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesTotalOrders(dateRange));

        CompletableFuture<BigDecimal> inventoryValueFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesTotalInventoryValue());

        CompletableFuture<Integer> totalProductsFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesTotalProducts());

        CompletableFuture<Integer> lowStockItemsFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesLowStockItems());

        CompletableFuture<Integer> averageCapacityFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesAverageCapacity());

        CompletableFuture<Integer> totalActiveUsersFuture = CompletableFuture.supplyAsync(() ->
                getAllWarehousesTotalActiveUsers());

        CompletableFuture.allOf(totalOrdersFuture, inventoryValueFuture,
                totalProductsFuture, lowStockItemsFuture,
                averageCapacityFuture, totalActiveUsersFuture).join();

        return DashboardStatsResponse.builder()
                .totalOrders(totalOrdersFuture.join())
                .totalInventoryValue(inventoryValueFuture.join())
                .totalProducts(totalProductsFuture.join())
                .lowStockItems(lowStockItemsFuture.join())
                .warehouseCapacity(averageCapacityFuture.join())
                .activeUsers(totalActiveUsersFuture.join())
                .timeFilter(timeFilter)
                .fromDate(LocalDateTime.parse(dateRange.getFromDate().toString()))
                .toDate(LocalDateTime.parse(dateRange.getToDate().toString()))
                .build();
    }

    // Helper methods cho từng warehouse (giữ nguyên như code hiện tại)
    private Integer getTotalOrders(String warehouseId, DateRange dateRange) {
        try {
            var importOrders = orderController.getOrdersByWarehouseAndDateRange(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());
            var exportOrders = orderController.getExportOrdersByWarehouseAndDateRange(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());

            return (importOrders.getResult().size() + exportOrders.getResult().size());
        } catch (Exception e) {
            log.warn("Failed to get total orders for warehouse {}: {}", warehouseId, e.getMessage());
            return 0;
        }
    }

    private BigDecimal getTotalInventoryValue(String warehouseId) {
        try {
            return inventoryWarehouseRepo.calculateTotalInventoryValue(warehouseId);
        } catch (Exception e) {
            log.warn("Failed to calculate inventory value for warehouse {}: {}", warehouseId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private Integer getTotalProducts(String warehouseId) {
        return inventoryProductRepo.countByWarehouseAndIsDeleted(warehouseId, false);
    }

    private Integer getLowStockItems(String warehouseId) {
        return inventoryProductRepo.countLowStockByWarehouse(warehouseId);
    }

    private Integer getActiveUsers(String warehouseId) {
        try {
            var activeUsers = userClient.getActiveUsersByWarehouse(warehouseId);
            return activeUsers.getResult().size();
        } catch (Exception e) {
            log.warn("Failed to get active users for warehouse {}: {}", warehouseId, e.getMessage());
            return 0;
        }
    }

    private Integer getWarehouseCapacity(String warehouseId) {
        try {
            var capacity = warehouseClient.getWarehouseCapacity(warehouseId);
            return capacity.getResult().getUtilizationPercentage();
        } catch (Exception e) {
            log.warn("Failed to get warehouse capacity for {}: {}", warehouseId, e.getMessage());
            return 0;
        }
    }

    // Helper methods cho tổng hợp tất cả warehouses
    private Integer getAllWarehousesTotalOrders(DateRange dateRange) {
        try {
            // Lấy tất cả warehouses và tính tổng orders
            var allWarehouses = warehouseClient.getAllList();
            return allWarehouses.getResult().stream()
                    .mapToInt(warehouse -> getTotalOrders(warehouse.getWarehouseId(), dateRange))
                    .sum();
        } catch (Exception e) {
            log.warn("Failed to get total orders for all warehouses: {}", e.getMessage());
            return 0;
        }
    }

    private BigDecimal getAllWarehousesTotalInventoryValue() {
        try {
            // Tính tổng inventory value của tất cả warehouses
            return inventoryWarehouseRepo.findAll().stream()
                    .filter(iw -> !iw.getIsDeleted())
                    .map(iw -> inventoryWarehouseRepo.calculateTotalInventoryValue(iw.getWarehouse()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            log.warn("Failed to calculate total inventory value for all warehouses: {}", e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private Integer getAllWarehousesTotalProducts() {
        return inventoryProductRepo.countByIsDeleted(false);
    }

    private Integer getAllWarehousesLowStockItems() {
        return inventoryProductRepo.countLowStock();
    }

    private Integer getAllWarehousesAverageCapacity() {
        try {
            var allWarehouses = warehouseClient.getAllList();
            var capacities = allWarehouses.getResult().stream()
                    .mapToInt(warehouse -> getWarehouseCapacity(warehouse.getWarehouseId()))
                    .filter(capacity -> capacity > 0)
                    .toArray();

            return capacities.length > 0 ?
                    (int) Arrays.stream(capacities).average().orElse(0) : 0;
        } catch (Exception e) {
            log.warn("Failed to calculate average warehouse capacity: {}", e.getMessage());
            return 0;
        }
    }

    private Integer getAllWarehousesTotalActiveUsers() {
        try {
            var allWarehouses = warehouseClient.getAllList();
            return allWarehouses.getResult().stream()
                    .mapToInt(warehouse -> getActiveUsers(warehouse.getWarehouseId()))
                    .sum();
        } catch (Exception e) {
            log.warn("Failed to get total active users for all warehouses: {}", e.getMessage());
            return 0;
        }
    }

    private DateRange calculateDateRange(String timeFilter) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fromDate;

        switch (timeFilter.toLowerCase()) {
            case "today":
                fromDate = now.toLocalDate().atStartOfDay();
                break;
            case "week":
                fromDate = now.minusWeeks(1);
                break;
            case "month":
                fromDate = now.minusMonths(1);
                break;
            default:
                fromDate = now.toLocalDate().atStartOfDay();
        }

        return new DateRange(fromDate, now);
    }

    @Data
    @AllArgsConstructor
    private static class DateRange {
        private LocalDateTime fromDate;
        private LocalDateTime toDate;
    }
}