package com.ddd.warehouse.Dto.Request;

import lombok.Builder;

@Builder
public record WarehousesRequest(
        String warehouseName,
        String address,
        String street,
        String district,
        String country,
        String managerId
) {
}
