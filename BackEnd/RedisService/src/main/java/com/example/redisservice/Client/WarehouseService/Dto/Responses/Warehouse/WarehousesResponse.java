package com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehousesResponse{
    String warehouseId;
    String warehouseName;
    String address;
    String street;
    String district;
    String country;
    String managerId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
