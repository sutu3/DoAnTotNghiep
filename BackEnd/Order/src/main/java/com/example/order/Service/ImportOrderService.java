package com.example.order.Service;

import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Module.ImportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImportOrderService {
    Page<ImportOrderResponse> getAllByWarehouse(String warehouse, Pageable pageable);
    ImportOrder getById(String id);
    ImportOrderResponse getByIdResponse(String id);
    Page<ImportOrderResponse> getAllByStatus(String warehouse,String status, Pageable pageable);
    @PreAuthorize("hasRole('STAFF')")
    ImportOrderResponse createOrder(ImportOrderRequest importOrderRequest);
    @PreAuthorize("hasRole('STAFF')")
    ImportOrderResponse updateOrder(ImportOrderForm update,String id);
    ImportOrderResponse deleteOrder(String id);
    @PreAuthorize("hasRole('STAFF')")
    ImportOrderResponse updateStatus(String id, StatusForm status);
    @PreAuthorize("hasRole('MANAGER')")
    ImportOrderResponse updateApprove(String id);
    @PreAuthorize("hasRole('MANAGER')")
    ImportOrderResponse updateReject(String id,ImportOrderForm form);
    ImportOrderResponse entry(ImportOrder importOrder);
    Integer getPendingOrdersByProduct(String productId, String warehouseId);
}
