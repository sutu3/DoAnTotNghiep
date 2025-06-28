package com.example.productservice.Dto.Responses.Category;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponseNoList {
    String categoryId;
    String categoryName;
    String description;
}
