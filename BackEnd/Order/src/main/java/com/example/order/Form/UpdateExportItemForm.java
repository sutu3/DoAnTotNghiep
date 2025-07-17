package com.example.order.Form;

import java.math.BigDecimal;

public record UpdateExportItemForm(
        Integer quantity,
        BigDecimal unitPrice,
        String binLocation,
        String batchNumber
) {
}
