package com.example.inventoryservice.Client.ProductService.Dto.Response;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductResponse {
    String productId;
    String productName;
    String sku;
    String description;
    String urlImageProduct;
    UnitNameResponse unit;
    BigDecimal price;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
