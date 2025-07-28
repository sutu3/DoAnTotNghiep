package com.example.order.Mapper;

import com.example.order.Dto.Request.ReceiptItemRequest;
import com.example.order.Dto.Response.ReceiptItem.ReceiptItemResponse;
import com.example.order.Module.ReceiptItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReceiptItemMapper {

    @Mapping(target = "receiptItemId", ignore = true)
    @Mapping(target = "warehouseReceipt", ignore = true)
    @Mapping(target = "importItem", ignore = true)
    @Mapping(target = "receivedAt", ignore = true)
    ReceiptItem toEntity(ReceiptItemRequest request);

    @Mapping(target = "receiptId", source = "warehouseReceipt.receiptId")
    @Mapping(target = "importItemId", source = "importItem.itemId")
    @Mapping(target = "importItem",ignore = true)
    ReceiptItemResponse toResponse(ReceiptItem entity);
}
