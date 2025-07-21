package com.example.productservice.Dto.Responses.Product;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponseNoList;
import com.example.productservice.Dto.Responses.Unit.UnitResponseNoList;
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
public class ProductResponse{
    String productId;
    String productName;
    String sku;
    String description;
    String urlImageProduct;
    BigDecimal price;
    SupplierResponse supplier;
    UserResponse createByUser;
    Boolean isActive;
    CategoryResponseNoList category;
    UnitResponseNoList unit;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
