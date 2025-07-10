package com.example.inventoryservice.Mapper;

import com.example.inventoryservice.Dtos.Request.StockMovementRequest;
import com.example.inventoryservice.Dtos.Response.StockMovementResponse;
import com.example.inventoryservice.Module.StockMovement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StockMovementMapper {

    // Convert request to entity
    @Mapping(target = "movementId", ignore = true)
    @Mapping(target = "quantityBefore", ignore = true)
    @Mapping(target = "quantityAfter", ignore = true)
    StockMovement toEntity(StockMovementRequest request);

    // Convert entity to response (ignore related objects - will be populated separately)
    @Mapping(target = "productDetails", ignore = true)
    @Mapping(target = "performedByUser", ignore = true)
    StockMovementResponse toResponse(StockMovement stockMovement);
}
