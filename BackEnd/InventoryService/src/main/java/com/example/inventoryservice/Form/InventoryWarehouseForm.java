package com.example.inventoryservice.Form;


import lombok.Builder;

import java.time.LocalDate;

@Builder
public record InventoryWarehouseForm(
        String bin,
        Integer quantity,
        LocalDate expiryDate,
        String status
) {}