package com.example.order.Dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptItemRequest {

    @NotBlank(message = "Import Item ID is required")
    String importItemId;
    @Min(value = 1, message = "Received quantity must be at least 1")
    Integer receivedQuantity;
    String binLocation;
    String note;
}
