package com.example.order.Dto.Request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExportOrderRequest(
        String warehouse,
        LocalDate deliveryDate,
        String customer,
        String description) {
}
