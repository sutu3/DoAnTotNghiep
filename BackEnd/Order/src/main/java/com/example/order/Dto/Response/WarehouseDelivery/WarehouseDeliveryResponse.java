package com.example.order.Dto.Response.WarehouseDelivery;

import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Dto.Response.DeliveryItem.DeliveryItemResponse;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Enum.DeliveryStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehouseDeliveryResponse {

    String deliveryId;
    String exportOrderId;
    UserResponse createdByUser;
    LocalDateTime deliveryDate;
    DeliveryStatus status;
    String notes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

    // Enriched data
    ExportOrderResponse exportOrder;
    List<DeliveryItemResponse> deliveryItems;
}
