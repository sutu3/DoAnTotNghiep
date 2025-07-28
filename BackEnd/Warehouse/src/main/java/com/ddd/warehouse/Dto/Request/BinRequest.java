package com.ddd.warehouse.Dto.Request;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record BinRequest(
        String binCode,
        BigDecimal capacity,
        String stack,
        String warehouse
) {
}
