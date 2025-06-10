package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record WarehousesResponse(
        String warehouseId,
        String warehouseName,
        String address,
        String street,
        String district,
        String country,
        String managerId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
