package com.example.inventoryservice.Mapper;

import com.example.inventoryservice.Dtos.Request.InventoryCheckSheetRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckSheetResponse;
import com.example.inventoryservice.Form.InventoryCheckSheetForm;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InventoryCheckSheetMapper {

    @Mapping(target = "checkSheetId", ignore = true)
    @Mapping(target = "checkDetails", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    InventoryCheckSheet toEntity(InventoryCheckSheetRequest request);

    @Mapping(target = "warehouseDetails", ignore = true)
    @Mapping(target = "performedByDetails", ignore = true)
    @Mapping(target = "checkDetails", ignore = true)
    InventoryCheckSheetResponse toResponse(InventoryCheckSheet entity);

    @Mapping(target = "checkSheetId", ignore = true)
    @Mapping(target = "checkDetails", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    void update(@MappingTarget InventoryCheckSheet entity, InventoryCheckSheetForm form);
}
