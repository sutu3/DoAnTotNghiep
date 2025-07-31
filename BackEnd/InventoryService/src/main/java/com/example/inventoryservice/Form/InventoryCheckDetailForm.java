package com.example.inventoryservice.Form;

import lombok.Builder;

import java.math.BigDecimal;
@Builder
public record InventoryCheckDetailForm(
        String inventoryWarehouseId,
        BigDecimal systemQuantity,
        BigDecimal actualQuantity,
        String adjustmentReason,
        String notes
) {
}
