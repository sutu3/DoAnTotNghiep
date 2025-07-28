package com.example.order.Dto.Request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehouseReceiptRequest {

    @NotBlank(message = "Import Order ID is required")
    String importOrderId;

    String note;

    @NotEmpty(message = "Receipt items cannot be empty")
    @Valid
    List<ReceiptItemRequest> receiptItems;
}
