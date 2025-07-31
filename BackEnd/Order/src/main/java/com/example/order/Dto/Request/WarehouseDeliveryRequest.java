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
public class WarehouseDeliveryRequest {

    @NotBlank(message = "Export Order ID is required")
    String exportOrderId;

    String notes;

    @NotEmpty(message = "Delivery items cannot be empty")
    @Valid
    List<DeliveryItemRequest> deliveryItems;
}
