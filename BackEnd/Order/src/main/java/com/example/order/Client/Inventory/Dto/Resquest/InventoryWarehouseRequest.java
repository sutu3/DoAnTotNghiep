package com.example.order.Client.Inventory.Dto.Resquest;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record InventoryWarehouseRequest(
        String product,
        String warehouse,
        String bin,
        BigDecimal quantity,
        LocalDate expiryDate,
        String status
) {}