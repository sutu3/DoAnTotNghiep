package com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse;

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
public class WarehousesResponse{
    String warehouseId;
    String warehouseName;
    String address;
    String street;
    String district;
    String country;
    String managerId;
}
