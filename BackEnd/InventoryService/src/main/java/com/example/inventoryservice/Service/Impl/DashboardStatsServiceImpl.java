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
    private final UserClient userClient;
    private final WarehouseClient warehouseClient;

    @Override
    public DashboardStatsResponse getDashboardStats(String warehouseId, String timeFilter) {
        log.info("Getting dashboard stats for warehouse: {} with filter: {}", warehouseId, timeFilter);

        DateRange dateRange = calculateDateRange(timeFilter);

        return DashboardStatsResponse.builder()
                .totalOrders(getTotalOrders(warehouseId, dateRange))
                .pendingOrders(getPendingOrders(warehouseId, dateRange))
                .completedOrders(getCompletedOrders(warehouseId, dateRange))
                .totalInventoryValue(getTotalInventoryValue(warehouseId))
                .totalProducts(getTotalProducts(warehouseId))
                .lowStockItems(getLowStockItems(warehouseId))
                .activeUsers(getActiveUsers(warehouseId))
                .warehouseCapacity(getWarehouseCapacity(warehouseId))
                .timeFilter(timeFilter)
                .fromDate(dateRange.getFromDate())
                .toDate(dateRange.getToDate())
                .build();
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

    private Integer getTotalOrders(String warehouseId, DateRange dateRange) {
        try {
            // Gọi OrderService để lấy tổng số orders
            var importOrders = orderController.getOrdersByWarehouseAndDateRange(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());
            var exportOrders = orderController.getExportOrdersByWarehouseAndDateRange(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());

            return (importOrders.getResult().size() + exportOrders.getResult().size());
        } catch (Exception e) {
            log.warn("Failed to get total orders: {}", e.getMessage());
            return 0;
        }
    }

    private Integer getPendingOrders(String warehouseId, DateRange dateRange) {
        try {
            var pendingImports = orderController.getPendingImportOrdersByWarehouse(warehouseId);
            var pendingExports = orderController.getPendingExportOrdersByWarehouse(warehouseId);

            return (pendingImports.getResult().size() + pendingExports.getResult().size());
        } catch (Exception e) {
            log.warn("Failed to get pending orders: {}", e.getMessage());
            return 0;
        }
    }

    private Integer getCompletedOrders(String warehouseId, DateRange dateRange) {
        try {
            var completedImports = orderController.getCompletedImportOrdersByWarehouse(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());
            var completedExports = orderController.getCompletedExportOrdersByWarehouse(
                    warehouseId, dateRange.getFromDate(), dateRange.getToDate());

            return (completedImports.getResult().size() + completedExports.getResult().size());
        } catch (Exception e) {
            log.warn("Failed to get completed orders: {}", e.getMessage());
            return 0;
        }
    }

    private BigDecimal getTotalInventoryValue(String warehouseId) {
        try {
            return inventoryWarehouseRepo.calculateTotalInventoryValue(warehouseId);
        } catch (Exception e) {
            log.warn("Failed to calculate inventory value: {}", e.getMessage());
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
            log.warn("Failed to get active users: {}", e.getMessage());
            return 0;
        }
    }

    private Integer getWarehouseCapacity(String warehouseId) {
        try {
            var capacity = warehouseClient.getWarehouseCapacity(warehouseId);
            return capacity.getResult().getUtilizationPercentage();
        } catch (Exception e) {
            log.warn("Failed to get warehouse capacity: {}", e.getMessage());
            return 0;
        }
    }

    @Data
    @AllArgsConstructor
    private static class DateRange {
        private LocalDateTime fromDate;
        private LocalDateTime toDate;
    }
}