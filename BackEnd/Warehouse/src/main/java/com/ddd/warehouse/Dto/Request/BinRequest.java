package com.ddd.warehouse.Dto.Request;

import lombok.Builder;

@Builder
public record BinRequest(
        String binCode,
        Integer capacity,
        String stack,
        String warehouse
) {
}
