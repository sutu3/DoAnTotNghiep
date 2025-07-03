package com.ddd.warehouse.Dto.Response.Bin;

import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Enum.BinStatus;
import com.ddd.warehouse.Module.Warehouses;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record BinResponse(
        String binId,
        String binCode,
        Integer capacity,
        BinStatus status,
        WarehousesResponse warehouse,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
