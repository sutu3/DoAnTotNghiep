package com.example.inventoryservice.Dtos.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryStatsResponse {
    String productId;
    String productName;
    BigDecimal currentStock;
    Integer pendingOrders;
    Integer minimumStock;
    BigDecimal averagePrice;
    LocalDateTime lastImportDate;
    List<String> recentSuppliers;
    WarehouseCapacityStats warehouseCapacity;
    List<SuggestedLocationStats> suggestedLocations;
}
