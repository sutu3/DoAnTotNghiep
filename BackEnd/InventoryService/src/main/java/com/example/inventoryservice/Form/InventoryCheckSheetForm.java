package com.example.inventoryservice.Form;

import com.example.inventoryservice.Enum.CheckSheetStatus;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record InventoryCheckSheetForm(
        String checkSheetNumber,
        String warehouseId,
        String performedBy,
        LocalDateTime checkDate,
        CheckSheetStatus status,
        String notes,
        String attachmentUrl
) {}
