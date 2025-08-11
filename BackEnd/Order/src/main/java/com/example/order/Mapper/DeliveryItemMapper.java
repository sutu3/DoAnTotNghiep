package com.example.order.Mapper;

import com.example.order.Dto.Request.DeliveryItemRequest;
import com.example.order.Dto.Response.DeliveryItem.DeliveryItemResponse;
import com.example.order.Module.DeliveryItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DeliveryItemMapper {

    @Mapping(target = "deliveryItemId", ignore = true)
    @Mapping(target = "warehouseDelivery", ignore = true)
    @Mapping(target = "exportItem", ignore = true)
    @Mapping(target = "deliveredAt", ignore = true)
    DeliveryItem toEntity(DeliveryItemRequest request);

    @Mapping(target = "deliveryId", source = "warehouseDelivery.deliveryId")
    @Mapping(target = "exportItemId", source = "exportItem.exportItemId")
    @Mapping(target = "exportItem", ignore = true)
    DeliveryItemResponse toResponse(DeliveryItem entity);
}
