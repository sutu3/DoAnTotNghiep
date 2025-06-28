package com.example.productservice.Form;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProductForm(
        String productName,
        String description,
        BigDecimal price,
        String createByUser,
        String category,
        String unit
) {
}
