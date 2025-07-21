package com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Stack;

import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class StackResponse {
    String stackId;
    String stackName;
    String description;
    List<BinResponse> bin;
    WarehousesResponse warehouse;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    LocalDateTime deletedAt;
}
