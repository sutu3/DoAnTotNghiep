package com.ddd.warehouse.Dto.Response.Bin;

import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record BinResponseNoWarehouse(
        String binId,
        String binCode,
        Integer capacity,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
