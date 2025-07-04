package com.example.order.Form;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ImportItemForm(
        int requestQuantity,
        String note,
        BigDecimal costUnitBase
) {
}
