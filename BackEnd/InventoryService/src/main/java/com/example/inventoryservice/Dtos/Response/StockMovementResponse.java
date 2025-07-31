package com.example.inventoryservice.Dtos.Response;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
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
    BigDecimal quantity;
    BigDecimal quantityBefore;
    BigDecimal quantityAfter;
    String referenceOrderId;
    String performedBy;
    String note;
    BigDecimal unitCost;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    String checkSheetId;

    // Enriched fields từ external services
    ProductResponse productDetails;
    UserResponse performedByUser;
}