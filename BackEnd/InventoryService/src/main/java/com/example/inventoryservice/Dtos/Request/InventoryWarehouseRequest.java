package com.example.inventoryservice.Dtos.Request;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record InventoryWarehouseRequest(
        String inventoryProductId,
        String product,
        String warehouse,
        String bin,
        Integer quantity,
        LocalDate expiryDate,
        String status
) {}