package com.example.productservice.Dto.Responses.Category;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    String categoryId;
    String categoryName;
    String description;
    UserResponse createByUser;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
