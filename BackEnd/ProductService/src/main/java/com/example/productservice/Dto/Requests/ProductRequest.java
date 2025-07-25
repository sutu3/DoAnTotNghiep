package com.example.productservice.Dto.Requests;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductRequest(
        String productName,
        String sku,
        String description,
        BigDecimal price,
        String urlImageProduct,
        String supplier,
        String category,
        String unit,
        Integer minStockLevel,
        Integer maxStockLevel
) {
}
