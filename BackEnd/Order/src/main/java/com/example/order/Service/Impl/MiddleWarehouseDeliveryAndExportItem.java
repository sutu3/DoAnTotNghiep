package com.example.order.Service.Impl;

import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Module.ExportItem;
import com.example.order.Service.ExportItemService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class MiddleWarehouseDeliveryAndExportItem {
    ExportItemService exportItemService;

    public ExportItem getById(String id) {
        return exportItemService.getById(id);
    }
    public ExportItemResponse entryExportItem(ExportItem request) {
        return exportItemService.entry(request);
    }
}
