package com.example.order.Dto.Response.WarehouseReceipt;

import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Dto.Response.ReceiptItem.ReceiptItemResponse;
import com.example.order.Enum.ReceiptStatus;
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
public class WarehouseReceiptResponse {

    String receiptId;
    String importOrderId;
    UserResponse createdByUser;
    LocalDateTime receivedDate;
    ReceiptStatus status;
    String note;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    Integer quantityReceiveItem;
    // Enriched data
    ImportOrderResponse importOrder;
//    List<ReceiptItemResponse> receiptItems;
}
