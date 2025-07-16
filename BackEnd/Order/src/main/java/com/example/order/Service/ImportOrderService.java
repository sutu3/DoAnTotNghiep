package com.example.order.Service;

import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Module.ImportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImportOrderService {
    Page<ImportOrderResponse> getAllByWarehouse(String warehouse, Pageable pageable);
    ImportOrder getById(String id);
    ImportOrderResponse getByIdResponse(String id);
    Page<ImportOrderResponse> getAllByStatus(String warehouse,String status, Pageable pageable);
    ImportOrderResponse createOrder(ImportOrderRequest importOrderRequest);
    ImportOrderResponse updateOrder(ImportOrderForm update,String id);
    ImportOrderResponse deleteOrder(String id);
    ImportOrderResponse updateStatus(String id, StatusForm status);
    ImportOrderResponse updateApprove(String id);
    ImportOrderResponse updateReject(String id,ImportOrderForm form);
    ImportOrderResponse entry(ImportOrder importOrder);
    Integer getPendingOrdersByProduct(String productId, String warehouseId);
}
