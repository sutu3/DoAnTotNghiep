package com.example.inventoryservice.Mapper;

import com.example.inventoryservice.Dtos.Request.InventoryProductRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductResponse;
import com.example.inventoryservice.Form.InventoryProductForm;
import com.example.inventoryservice.Module.InventoryProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InventoryProductMapper {

    // Convert request to entity
    @Mapping(target = "inventoryProductId", ignore = true)
    @Mapping(target = "lastImportDate", ignore = true)
    @Mapping(target = "lastExportDate", ignore = true)
    @Mapping(target = "inventoryWarehouses", ignore = true)
    InventoryProduct toEntity(InventoryProductRequest request);

    // Convert entity to response (ignore related objects - will be populated separately)
    @Mapping(target = "productDetails", ignore = true)
    @Mapping(target = "warehouseDetails", ignore = true)
    @Mapping(target = "inventoryWarehouses", ignore = true)
    InventoryProductResponse toResponse(InventoryProduct inventoryProduct);

    // Update entity from form
    @Mapping(target = "inventoryProductId", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "lastImportDate", ignore = true)
    @Mapping(target = "lastExportDate", ignore = true)
    @Mapping(target = "inventoryWarehouses", ignore = true)
    void update(@MappingTarget InventoryProduct inventoryProduct, InventoryProductForm form);
}