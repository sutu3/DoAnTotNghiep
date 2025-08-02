package com.example.inventoryservice.Dtos.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckDetailResponse {
    String checkDetailId;
    String checkSheetId;
    String inventoryWarehouseId;
    BigDecimal systemQuantity;
    BigDecimal actualQuantity;
    BigDecimal difference;
    String adjustmentReason;
    String notes;

    // Enriched data
    InventoryWarehouseResponse inventoryWarehouseDetails;
}
