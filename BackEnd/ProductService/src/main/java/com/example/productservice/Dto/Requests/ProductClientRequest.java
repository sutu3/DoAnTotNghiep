package com.example.productservice.Dto.Requests;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponseNoList;
import com.example.productservice.Dto.Responses.Unit.UnitResponseNoList;
import com.example.productservice.Model.Category;
import com.example.productservice.Model.Unit;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class ProductClientRequest {
    String productId;
    String productName;
    String sku;
    String description;
    String urlImageProduct;
    BigDecimal quantity;
    Boolean isActive;
    BigDecimal price;
    String supplier;
    String createByUser;
    Boolean IsActive;
    String category;
    String unit;
}
