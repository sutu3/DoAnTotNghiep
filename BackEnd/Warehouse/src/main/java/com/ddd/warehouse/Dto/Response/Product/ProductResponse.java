package com.ddd.warehouse.Dto.Response.Product;

import com.ddd.warehouse.Module.Category;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductResponse(
    String productId,
    String skuCode,
    String productName,
    BigDecimal productPrice,
    String urlImage,
    String description,
    Category category,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Boolean isDeleted,
    LocalDateTime deletedAt
){
}
