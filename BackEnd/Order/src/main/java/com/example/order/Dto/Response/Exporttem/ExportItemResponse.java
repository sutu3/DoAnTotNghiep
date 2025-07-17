package com.example.order.Dto.Response.Exporttem;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Enum.ExportItemStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExportItemResponse {
    String exportItemId;
    ProductResponse product;
    UnitNameResponse unit;
    Integer quantity;
    BigDecimal unitPrice;
    String binLocation;
    String batchNumber;
    ExportItemStatus status;
    UserResponse createByUser;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
