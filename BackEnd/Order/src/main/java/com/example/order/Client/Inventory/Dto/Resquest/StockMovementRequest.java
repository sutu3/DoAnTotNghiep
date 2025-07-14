package com.example.order.Client.Inventory.Dto.Resquest;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record StockMovementRequest(
        String inventoryWarehouseId,
        String product,
        String movementType,
        Integer quantity,
        String referenceOrderId,
        String performedBy,
        String note,
        BigDecimal unitCost
) {}
