package com.example.order.Mapper;

import com.example.order.Dto.Request.WarehouseDeliveryRequest;
import com.example.order.Dto.Response.WarehouseDelivery.WarehouseDeliveryResponse;
import com.example.order.Module.WarehouseDelivery;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WarehouseDeliveryMapper {

    @Mapping(target = "exportOrder", ignore = true)
    @Mapping(target = "deliveryItems", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(target = "deliveryDate", ignore = true)
    @Mapping(target = "status", ignore = true)
    WarehouseDelivery toEntity(WarehouseDeliveryRequest request);

    @Mapping(target = "exportOrderId", source = "exportOrder.exportOrderId")
    @Mapping(target = "exportOrder", ignore = true)
    @Mapping(target = "deliveryItems", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    WarehouseDeliveryResponse toResponse(WarehouseDelivery entity);
}
