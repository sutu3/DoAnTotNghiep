package com.example.order.Mapper;

import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Module.ImportOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ImportOrderMapper {
    @Mapping(target = "warehouse",ignore = true)
    @Mapping(target = "createByUser",ignore = true)
    ImportOrder toEntity(ImportOrderRequest importOrderRequest);
    @Mapping(target = "createByUser",ignore = true)
    @Mapping(target = "accessByAdmin",ignore = true)
    @Mapping(target = "warehouse",ignore = true)
    ImportOrderResponse toResponse(ImportOrder importOrder);
    void toUpdate(@MappingTarget ImportOrder importOrder, ImportOrderForm update);
}
