package com.example.inventoryservice.Mapper;

import com.example.inventoryservice.Dtos.Request.InventoryCheckDetailRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckDetailResponse;
import com.example.inventoryservice.Form.InventoryCheckDetailForm;
import com.example.inventoryservice.Module.InventoryCheckDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InventoryCheckDetailMapper {

    @Mapping(target = "checkDetailId", ignore = true)
    @Mapping(target = "checkSheet", ignore = true)
    @Mapping(target = "difference", ignore = true)
    InventoryCheckDetail toEntity(InventoryCheckDetailRequest request);

    @Mapping(target = "checkSheetId", source = "checkSheet.checkSheetId")
    @Mapping(target = "inventoryWarehouseDetails", ignore = true)
    InventoryCheckDetailResponse toResponse(InventoryCheckDetail entity);
    @Mapping(target = "checkSheet",ignore = true)
    void update(@MappingTarget InventoryCheckDetail entity, InventoryCheckDetailForm form);
}
