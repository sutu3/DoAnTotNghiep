package com.example.order.Mapper;

import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Module.ExportItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExportItemMapper {
    @Mapping(target = "exportOrder",ignore = true)
    ExportItem toEntity(ExportItemRequest exportItemRequest);
    @Mapping(target = "product",ignore = true)
    @Mapping(target = "unit",ignore = true)
    @Mapping(target = "createByUser",ignore = true)
    ExportItemResponse toResponse(ExportItem entity);
    void toUpdate(@MappingTarget ExportItem exportItem, UpdateExportItemForm form);
}
