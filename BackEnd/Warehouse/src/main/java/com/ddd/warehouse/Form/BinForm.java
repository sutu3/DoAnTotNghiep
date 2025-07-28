package com.ddd.warehouse.Form;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record BinForm(
        String binCode,
        BigDecimal capacity
) {
}
