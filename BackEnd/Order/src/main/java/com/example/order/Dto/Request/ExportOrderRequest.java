package com.example.order.Dto.Request;

import java.time.LocalDateTime;

public record ExportOrderRequest(
        String warehouse,
        String createByUser,
        LocalDateTime deliveryDate,
        String customer,

        String description) {
}
