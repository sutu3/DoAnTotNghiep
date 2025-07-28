package com.example.productservice.Form;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductForm(
        String productName,
        String description,
        BigDecimal price,
        String category,
        String unit,
        String supplier,
        Integer minStockLevel,
        Integer maxStockLevel,
        String sku,
        String urlImageProduct
) {
}
