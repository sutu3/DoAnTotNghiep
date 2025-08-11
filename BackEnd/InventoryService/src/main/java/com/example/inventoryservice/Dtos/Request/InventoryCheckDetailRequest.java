package com.example.inventoryservice.Dtos.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckDetailRequest {
    @NotBlank
    String inventoryWarehouseId;
    @NotNull
    BigDecimal systemQuantity;
    @NotNull
    BigDecimal actualQuantity;
    String adjustmentReason;
    String notes;
}
