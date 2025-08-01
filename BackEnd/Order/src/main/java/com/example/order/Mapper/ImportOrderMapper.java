package com.example.order.Mapper;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponseClient;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponseClient;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Module.ExportOrder;
import com.example.order.Module.ImportOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = ImportItemMapper.class)
public interface ImportOrderMapper {
    ImportOrder toEntity(ImportOrderRequest importOrderRequest);

    @Mapping(target = "createByUser", ignore = true)
    @Mapping(target = "accessByAdmin", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "importItems", ignore = true) // Ignore vì sẽ được populate riêng
    ImportOrderResponse toResponse(ImportOrder importOrder);

    void toUpdate(@MappingTarget ImportOrder importOrder, ImportOrderForm update);
    ImportOrderResponseClient toClient(ImportOrder importOrder);
}

