package com.ddd.warehouse.Form;

import lombok.Builder;

@Builder
public record BinForm(
        String binCode,
        Integer capacity
) {
}
