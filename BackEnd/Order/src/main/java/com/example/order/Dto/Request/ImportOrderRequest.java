package com.example.order.Dto.Request;

import lombok.Builder;

public record ImportOrderRequest(
        String warehouse,
        String note
        ) {
}
