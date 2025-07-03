package com.ddd.warehouse.Dto.Response.Stack;

import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponseNoWarehouse;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StackResponse{
    String stackId;
    String stackName;
    String description;
    List<BinResponseNoWarehouse> bin;
    WarehousesResponse warehouse;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    LocalDateTime deletedAt;
}
