package com.example.order.Controller;

import com.example.order.Dto.Request.ExportOrderRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponse;
import com.example.order.Dto.Response.ExportOrder.ExportOrderResponseClient;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Form.StatusForm;
import com.example.order.Service.ExportOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/exportOrders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Export Order API", description = "Quản lý các đơn xuất hàng")
public class ExportOrderController {

    ExportOrderService exportOrderService;

    @GetMapping("/search")
    public ApiResponse<Page<ExportOrderResponse>> getAllByWarehouse(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String status,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ExportOrderResponse>>builder()
                .Result(exportOrderService.getExportOrdersByWarehouse(warehouseId, pageable,status))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouse/{warehouseId}/date-range")
    public ApiResponse<List<ExportOrderResponseClient>> getExportOrdersByWarehouseAndDateRange(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    ) {
        return ApiResponse.<List<ExportOrderResponseClient>>builder()
                .Result(exportOrderService.getExportOrdersByWarehouseAndDateRange(warehouseId, fromDate, toDate))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/approved-orders/product/{productId}/warehouse/{warehouseId}")
    public ApiResponse<Integer> getApprovedExportOrdersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<Integer>builder()
                .Result(exportOrderService.getApprovedOrdersByProduct(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouse/{warehouseId}/status/pending")
    public ApiResponse<List<ExportOrderResponseClient>> getPendingExportOrdersByWarehouse(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<ExportOrderResponseClient>>builder()
                .Result(exportOrderService.getPendingExportOrdersByWarehouse(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/search/warehouse/{warehouseId}/status/completed/date-range")
    public ApiResponse<List<ExportOrderResponseClient>> getCompletedExportOrdersByWarehouse(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    ) {
        return ApiResponse.<List<ExportOrderResponseClient>>builder()
                .Result(exportOrderService.getCompletedExportOrdersByWarehouse(warehouseId, fromDate, toDate))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/search/status/{status}")
    public ApiResponse<Page<ExportOrderResponse>> getAllByStatus(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        ExportOrderStatus orderStatus = ExportOrderStatus.valueOf(status.toUpperCase());
        return ApiResponse.<Page<ExportOrderResponse>>builder()
                .Result(exportOrderService.getExportOrdersByStatus(orderStatus, pageable))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/status/{status}/warehouseId/{warehouseId}")
    public ApiResponse<Page<ExportOrderResponse>> getAllByStatus(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String status,
            @PathVariable String warehouseId

    ) {
        Pageable pageable = PageRequest.of(page, size);
        ExportOrderStatus orderStatus = ExportOrderStatus.valueOf(status.toUpperCase());
        return ApiResponse.<Page<ExportOrderResponse>>builder()
                .Result(exportOrderService.getExportOrdersByStatusAndWarehouse(orderStatus,warehouseId, pageable))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/{orderId}")
    public ApiResponse<ExportOrderResponse> getById(@PathVariable String orderId) {
        return ApiResponse.<ExportOrderResponse>builder()
                .Result(exportOrderService.getExportOrderResponseById(orderId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @PostMapping
    public ApiResponse<ExportOrderResponse> createOrder(@RequestBody ExportOrderRequest request) {
        return ApiResponse.<ExportOrderResponse>builder()
                .Result(exportOrderService.createExportOrder(request))
                .code(0)
                .message("Export order created successfully")
                .success(true)
                .build();
    }

//    @PutMapping("/{orderId}")
//    public ApiResponse<ExportOrderResponse> updateOrder(
//            @PathVariable String orderId,
//            @RequestBody ExportOrderForm update
//    ) {
//        return ApiResponse.<ExportOrderResponse>builder()
//                .Result(exportOrderService.updateExportOrder(update, orderId))
//                .code(0)
//                .message("Export order updated successfully")
//                .success(true)
//                .build();
//    }

    @PutMapping("/{orderId}/approve")
    public ApiResponse<ExportOrderResponse> approveOrder(
            @PathVariable String orderId
    ) {
        return ApiResponse.<ExportOrderResponse>builder()
                .Result(exportOrderService.approveExportOrder(orderId))
                .code(0)
                .message("Export order approved successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{orderId}/reject")
    public ApiResponse<ExportOrderResponse> rejectOrder(
            @PathVariable String orderId
    ) {
        return ApiResponse.<ExportOrderResponse>builder()
                .Result(exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.CANCELLED))
                .code(0)
                .message("Export order rejected")
                .success(true)
                .build();
    }

    @GetMapping("/pending-approvals")
    public ApiResponse<List<ExportOrderResponse>> getPendingApprovals() {
        return ApiResponse.<List<ExportOrderResponse>>builder()
                .Result(exportOrderService.getExportOrdersForApproval())
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/pending-approvals/search/warehouse/{warehouseId}")
    public ApiResponse<Page<ExportOrderResponse>> getPendingApprovalsByWarehouse(
            @PathVariable String warehouseId,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ExportOrderResponse>>builder()
                .Result(exportOrderService.getExportOrdersForApprovalByWarehouse(warehouseId,pageable))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<ExportOrderResponse> updateStatus(
            @PathVariable String orderId,
            @RequestBody StatusForm statusForm
    ) {
        ExportOrderStatus status = ExportOrderStatus.valueOf(statusForm.status());
        return ApiResponse.<ExportOrderResponse>builder()
                .Result(exportOrderService.updateExportOrderStatus(orderId, status))
                .code(0)
                .message("Status updated successfully")
                .success(true)
                .build();
    }

    @DeleteMapping("/{orderId}")
    public ApiResponse<String> deleteOrder(@PathVariable String orderId) {
        exportOrderService.deleteExportOrder(orderId);
        return ApiResponse.<String>builder()
                .code(0)
                .message("Export order deleted successfully")
                .success(true)
                .build();
    }
}