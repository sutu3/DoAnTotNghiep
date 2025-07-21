package com.example.order.Client.ProductService.Dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UnitNameResponse {
    String unitID;
    String unitName;
    String shortName;
    Float ratioToBase;
    Boolean isDefault;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
