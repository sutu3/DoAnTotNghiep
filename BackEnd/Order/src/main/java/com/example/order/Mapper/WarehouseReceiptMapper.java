package com.example.order.Mapper;

import com.example.order.Dto.Request.WarehouseReceiptRequest;
import com.example.order.Dto.Response.WarehouseReceipt.WarehouseReceiptResponse;
import com.example.order.Module.WarehouseReceipt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WarehouseReceiptMapper {

    @Mapping(target = "importOrder", ignore = true)
    @Mapping(target = "receiptItems", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(target = "receivedDate", ignore = true)
    @Mapping(target = "status", ignore = true)
    WarehouseReceipt toEntity(WarehouseReceiptRequest request);

    @Mapping(target = "importOrderId", source = "importOrder.importOrderId")
    @Mapping(target = "importOrder", ignore = true)
    @Mapping(target = "quantityReceiveItem", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    WarehouseReceiptResponse toResponse(WarehouseReceipt entity);
}
