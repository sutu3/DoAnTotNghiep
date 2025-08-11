package com.ddd.warehouse.Dto.Response.Warehouse;

import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponseNoWarehouse;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Dto.Response.Stack.StackResponseNoList;
import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Stacks;
import jakarta.persistence.OneToMany;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record WarehousesResponse(
        String warehouseId,
        String warehouseName,
        String address,
        String street,
        String district,
        String country,
        String description,
        List<BinResponseNoWarehouse> bins,
        List<StackResponseNoList> stacks,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
