package com.example.order.Dto.Request;

import java.math.BigDecimal;

public record ExportItemRequest(
        String exportOrderId,
        String product,
        String unit,
        Integer quantity,
        BigDecimal unitPrice,
        String binLocation,
        String batchNumber
) {
}
