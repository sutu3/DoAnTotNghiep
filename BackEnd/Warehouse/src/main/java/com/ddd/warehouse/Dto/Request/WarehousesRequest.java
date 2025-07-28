package com.ddd.warehouse.Dto.Request;

import lombok.Builder;

@Builder
public record WarehousesRequest(
        String warehouseName,
        String address,
        String street,
        String description,
        String district,
        String country) {
}
