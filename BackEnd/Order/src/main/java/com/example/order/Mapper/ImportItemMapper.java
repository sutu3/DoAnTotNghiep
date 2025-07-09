package com.example.order.Mapper;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Form.ImportItemForm;
import com.example.order.Module.ImportItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface ImportItemMapper {
    @Mapping(target = "importOrder",ignore = true)
    @Mapping(target = "expiredDate",ignore = true)
    ImportItem toEntity(ImportRequestItem requestItem);
    @Mapping(target = "product",ignore = true)
    @Mapping(target = "unit",ignore = true)
    @Mapping(target = "supplier",ignore = true)
    @Mapping(target = "bin",ignore = true)
    @Mapping(target = "createByUser",ignore = true)
    ImportResponseItem toResponse(ImportItem importItem);
    void toUpdate(@MappingTarget ImportItem importItem, ImportItemForm update);
}
