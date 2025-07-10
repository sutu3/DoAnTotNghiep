package com.example.inventoryservice.Dtos.Request;

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
