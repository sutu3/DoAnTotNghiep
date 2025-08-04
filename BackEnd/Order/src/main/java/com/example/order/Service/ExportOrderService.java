package com.example.order.Service;

import com.example.order.Dto.Request.ExportOrderRequest;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponseClient;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Module.ExportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface ExportOrderService {
    @PreAuthorize("hasRole('STAFF')")
    ExportOrderResponse createExportOrder(ExportOrderRequest request);
    ExportOrder getExportOrderById(String exportOrderId);
    ExportOrderResponse getExportOrderResponseById(String exportOrderId);


    Page<ExportOrderResponse> getAllExportOrders(Pageable pageable);

    Page<ExportOrderResponse> getExportOrdersByWarehouse(String warehouse, Pageable pageable,String status);

    Page<ExportOrderResponse> getExportOrdersByUser(String userId, Pageable pageable);

    Page<ExportOrderResponse> getExportOrdersByStatus(ExportOrderStatus status, Pageable pageable);
    Page<ExportOrderResponse> getExportOrdersByStatusAndWarehouse(ExportOrderStatus status,String warehouseId, Pageable pageable);


    ExportOrderResponse updateExportOrderStatus(String exportOrderId, ExportOrderStatus status);
    @PreAuthorize("hasRole('MANAGER')")
    ExportOrderResponse approveExportOrder(String exportOrderId);

    void deleteExportOrder(String exportOrderId);

    List<ExportOrderResponse> getExportOrdersForApproval();
    Page<ExportOrderResponse> getExportOrdersForApprovalByWarehouse(String warehouse, Pageable pageable);

    ExportOrderResponse entry(ExportOrder exportOrder);
    List<ExportOrderResponseClient> getExportOrdersByWarehouseAndDateRange(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate);
    List<ExportOrderResponseClient> getPendingExportOrdersByWarehouse(String warehouseId);
    List<ExportOrderResponseClient> getCompletedExportOrdersByWarehouse(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate);
    List<ExportOrderResponse> getOrdersReadyForDelivery(String warehouseId);
    Integer getApprovedOrdersByProduct(String productId, String warehouseId);
}
