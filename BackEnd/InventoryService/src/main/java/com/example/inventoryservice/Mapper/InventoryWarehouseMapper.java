package com.example.inventoryservice.Mapper;

import com.example.inventoryservice.Dtos.Request.InventoryWarehouseRequest;
import com.example.inventoryservice.Dtos.Response.InventoryWarehouseResponse;
import com.example.inventoryservice.Form.InventoryWarehouseForm;
import com.example.inventoryservice.Module.InventoryWarehouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InventoryWarehouseMapper {

    // Convert request to entity
    @Mapping(target = "inventoryWarehouseId", ignore = true)
    @Mapping(target = "inventoryProduct", ignore = true)
    InventoryWarehouse toEntity(InventoryWarehouseRequest request);

    // Convert entity to response (ignore related objects - will be populated separately)
    @Mapping(target = "productDetails", ignore = true)
    @Mapping(target = "warehouseDetails", ignore = true)
    @Mapping(target = "binDetails", ignore = true)
    InventoryWarehouseResponse toResponse(InventoryWarehouse inventoryWarehouse);

    // Update entity from form
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "inventoryProduct", ignore = true)
    void update(@MappingTarget InventoryWarehouse inventoryWarehouse, InventoryWarehouseForm form);
}

