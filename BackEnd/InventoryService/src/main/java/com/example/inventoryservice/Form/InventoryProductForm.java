package com.example.inventoryservice.Form;

import lombok.Builder;

@Builder
public record InventoryProductForm(
        Integer totalQuantity,
        Integer minStockLevel,
        Integer maxStockLevel,
        String status
) {}
