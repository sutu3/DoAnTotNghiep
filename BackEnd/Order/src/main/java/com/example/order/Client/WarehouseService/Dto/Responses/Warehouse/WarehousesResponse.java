package com.example.order.Client.WarehouseService.Dto.Responses.Warehouse;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehousesResponse{
    private String warehouseId;

    String warehouseName;
    String managerId;
}
