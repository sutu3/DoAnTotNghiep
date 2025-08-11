package com.example.order.Dto.Response.DeliveryItem;


import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryItemResponse {

    String deliveryItemId;
    String deliveryId;
    String exportItemId;
    BigDecimal deliveredQuantity;
    String binLocation;
    LocalDateTime deliveredAt;
    String note;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

    // Enriched data
    ExportItemResponse exportItem;
    BinResponse binDetails;
}
