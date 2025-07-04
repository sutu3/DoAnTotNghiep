package com.example.order.Dto.Request;

import lombok.Builder;

import java.math.BigDecimal;
@Builder
public record ImportRequestItem(
        String product,
        String warehouse,
        String supplier,
        String unit,
        int requestQuantity,
        String note,
        BigDecimal costUnitBase,
        String createByUser) {
}
