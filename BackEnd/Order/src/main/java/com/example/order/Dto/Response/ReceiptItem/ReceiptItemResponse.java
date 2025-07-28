package com.example.order.Dto.Response.ReceiptItem;

import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptItemResponse {

    String receiptItemId;
    String receiptId;
    String importItemId;
    Integer receivedQuantity;
    String binLocation;
    LocalDateTime receivedAt;
    String note;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

    // Enriched data
    ImportResponseItem importItem;
    BinResponse binDetails;
}
