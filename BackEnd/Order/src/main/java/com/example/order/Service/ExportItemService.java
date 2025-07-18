package com.example.order.Service;

import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Module.ExportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExportItemService {

    Page<ExportItemResponse> getAllByWarehouse(Pageable pageable, String warehouse);

    List<ExportItemResponse> getAllByOrder(String orderId);

    ExportItem getById(String id);

    ExportItemResponse getByIdResponse(String id);

    ExportItemResponse createItem(ExportItemRequest request);

    List<ExportItemResponse> createItems(List<ExportItemRequest> requests);

    ExportItemResponse updateItem(UpdateExportItemForm update, String id);

    void deleteItem(String id);

    ExportItemResponse updateQuantity(String itemId, Integer quantity);

    ExportItemResponse updateBinLocation(String itemId, String binLocation);

    void executeExport(String orderId, List<ExportItemRequest> items);

    ExportItemResponse entry(ExportItem exportItem);
}
