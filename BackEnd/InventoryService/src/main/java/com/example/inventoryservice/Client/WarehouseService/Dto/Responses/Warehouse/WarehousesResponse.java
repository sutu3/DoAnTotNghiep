package com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehousesResponse{
    String warehouseName;
    String managerId;
}
