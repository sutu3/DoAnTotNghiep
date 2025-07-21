package com.example.productservice.Client.Inventory.Dto.Resquest;

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
