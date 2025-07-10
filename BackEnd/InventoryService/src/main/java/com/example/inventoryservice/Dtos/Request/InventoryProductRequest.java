package com.example.inventoryservice.Dtos.Request;

import lombok.Builder;

@Builder
public record InventoryProductRequest(
        String product,
        String warehouse,
        Integer totalQuantity,
        Integer minStockLevel,
        Integer maxStockLevel,
        String status
) {}
