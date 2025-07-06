package com.example.order.Dto.Request;

import lombok.Builder;

@Builder
public record ImportOrderRequest(
        String warehouse,
        String createByUser,
        String note
        ) {
}
