package com.example.inventoryservice.Form;


import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record InventoryWarehouseForm(
        String bin,
        BigDecimal quantity,
        LocalDate expiryDate,
        String status
) {}