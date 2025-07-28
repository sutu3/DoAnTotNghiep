package com.example.productservice.Client.Inventory.Dto.Resquest;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record InventoryProductRequest(
        String product,
        String warehouse,
        BigDecimal totalQuantity,
        Integer minStockLevel,
        Integer maxStockLevel,
        String status
) {}
