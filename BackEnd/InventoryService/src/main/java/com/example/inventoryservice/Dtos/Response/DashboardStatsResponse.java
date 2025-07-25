package com.example.inventoryservice.Dtos.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardStatsResponse {
     Integer totalOrders;
     Integer pendingOrders;
     Integer completedOrders;
     BigDecimal totalInventoryValue;
     Integer totalProducts;
     Integer lowStockItems;
     Integer activeUsers;
     Integer warehouseCapacity;
     String timeFilter;
     LocalDateTime fromDate;
     LocalDateTime toDate;
}
