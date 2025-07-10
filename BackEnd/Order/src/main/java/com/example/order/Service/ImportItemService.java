package com.example.order.Service;

import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Form.ImportItemForm;
import com.example.order.Module.ImportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImportItemService {
    Page<ImportResponseItem> getAllByWarehouse(Pageable pageable,String warehouse);
    List<ImportResponseItem> getAllByOrder(String order);
    ImportItem getById(String id);
    ImportResponseItem getByIdResponse(String id);
    ImportResponseItem createItem(ImportRequestItem importResponseItem);
    List<ImportResponseItem> createItems(List<ImportRequestItem> requests);
    ImportResponseItem updateItem(ImportItemForm update,String id);
    void deleteItem(String id);
    ImportResponseItem entry(ImportItem importItem);
    List<String> getRecentSuppliersByProduct(String productId, String warehouseId);

}
