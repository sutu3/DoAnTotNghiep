package com.ddd.warehouse.Dto.Response.Bin;

import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Enum.BinStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record BinResponseNoWarehouse(
        String binId,
        String binCode,
        BigDecimal capacity,
        BigDecimal currentOccupancy,
        BinStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
