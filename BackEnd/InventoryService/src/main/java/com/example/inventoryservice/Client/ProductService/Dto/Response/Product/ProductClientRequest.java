package com.example.inventoryservice.Client.ProductService.Dto.Response.Product;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductClientRequest {
    String productId;
    String productName;
    String sku;
    String description;
    String urlImageProduct;
    Boolean isActive;
    BigDecimal price;
    String supplier;
    String createByUser;
    Boolean IsActive;
    String category;
    String unit;
}
