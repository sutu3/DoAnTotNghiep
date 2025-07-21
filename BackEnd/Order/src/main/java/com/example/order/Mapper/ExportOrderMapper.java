package com.example.order.Mapper;

import com.example.order.Dto.Request.ExportOrderRequest;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Module.ExportOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExportOrderMapper {

    ExportOrder toEntity(ExportOrderRequest exportOrderRequest);
    @Mapping(target = "warehouse",ignore = true)
    @Mapping(target = "createByUser",ignore = true)
    @Mapping(target = "customer",ignore = true)
    @Mapping(target = "approvedBy",ignore = true)
    ExportOrderResponse toResponse(ExportOrder exportOrder);
}
