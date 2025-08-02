package com.example.order.Dto.Request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryItemRequest {

    @NotBlank(message = "Export Item ID is required")
    String exportItemId;

    @NotNull(message = "Delivered quantity is required")
    @DecimalMin(value = "0.001", message = "Delivered quantity must be greater than 0")
    BigDecimal deliveredQuantity;

    String binLocation;
    String note;
}
