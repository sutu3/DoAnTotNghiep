package com.example.productservice.Client.Inventory.Dto.Resquest;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record StockMovementRequest(
        String inventoryWarehouseId,
        String product,
        String movementType,
        BigDecimal quantity,
        String referenceOrderId,
        String performedBy,
        String note,
        BigDecimal unitCost
) {}
