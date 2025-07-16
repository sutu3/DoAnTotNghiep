package com.example.productservice.Client.Inventory.Dto.Response;



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
public class StockMovementResponse {
    String movementId;
    String inventoryWarehouseId;
    String product;
    String movementType;
    Integer quantity;
    Integer quantityBefore;
    Integer quantityAfter;
    String referenceOrderId;
    String performedBy;
    String note;
    BigDecimal unitCost;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

}