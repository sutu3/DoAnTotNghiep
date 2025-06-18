package com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehousesResponse{
    String warehouseName;
    String managerId;
}
