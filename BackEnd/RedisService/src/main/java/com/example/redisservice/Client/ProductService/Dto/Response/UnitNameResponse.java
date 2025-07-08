package com.example.redisservice.Client.ProductService.Dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UnitNameResponse {
    String unitID;
    String unitName;
    String shortName;
    Float ratioToBase;
    Boolean isDefault;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
