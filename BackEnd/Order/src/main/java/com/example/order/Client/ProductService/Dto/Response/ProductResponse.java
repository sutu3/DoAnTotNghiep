package com.example.order.Client.ProductService.Dto.Response;


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
public class ProductResponse {
    String productId;
    String productName;
    String sku;
    String description;
    String urlImageProduct;
    BigDecimal price;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
