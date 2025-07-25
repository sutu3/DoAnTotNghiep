package com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class WarehousesResponse{
    String warehouseId;
    String warehouseName;
    String managerId;
}
