package com.example.order.Controller;

import com.example.order.Dto.Request.ImportOrderRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.ImportOrder.ImportOrderResponse;
import com.example.order.Form.ImportOrderForm;
import com.example.order.Form.StatusForm;
import com.example.order.Service.ImportOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/importOrders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Import Order API", description = "Quản lý các don hang  ")
public class ImportOrderController {
    ImportOrderService importOrderService;

    // GET - Lấy tất cả orders theo warehouse với pagination
    @GetMapping("/search/warehouse/{warehouseId}")
    public ApiResponse<Page<ImportOrderResponse>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ImportOrderResponse>>builder()
                .Result(importOrderService.getAllByWarehouse(warehouseId, pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // GET - Lấy orders theo status
    @GetMapping("/search/warehouse/{warehouseId}/status/{status}")
    public ApiResponse<Page<ImportOrderResponse>> getAllByStatus(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId,
            @PathVariable String status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ImportOrderResponse>>builder()
                .Result(importOrderService.getAllByStatus(warehouseId, status, pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    /**
     * Lấy số lượng đơn hàng đang chờ xử lý cho một sản phẩm trong warehouse
     * @param productId ID của sản phẩm
     * @param warehouseId ID của warehouse
     * @return Integer - Tổng số lượng sản phẩm trong các đơn hàng đang chờ
     */
    @GetMapping("/pending-orders/product/{productId}/warehouse/{warehouseId}")
    public ApiResponse<Integer> getPendingOrdersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<Integer>builder()
                .Result(importOrderService.getPendingOrdersByProduct(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    // GET - Lấy order theo ID
    @GetMapping("/{orderId}")
    public ApiResponse<ImportOrderResponse> getById(@PathVariable String orderId) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.getByIdResponse(orderId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // POST - Tạo order mới
    @PostMapping
    public ApiResponse<ImportOrderResponse> createOrder(@RequestBody ImportOrderRequest request) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.createOrder(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // PUT - Cập nhật order
    @PutMapping("/{orderId}")
    public ApiResponse<ImportOrderResponse> updateOrder(
            @PathVariable String orderId,
            @RequestBody ImportOrderForm update
    ) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.updateOrder(update, orderId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // PUT - Cập nhật status order
    @PutMapping("/{orderId}/status")
    public ApiResponse<ImportOrderResponse> updateStatus(
            @PathVariable String orderId,
            @RequestBody StatusForm statusForm
    ) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.updateStatus(orderId, statusForm))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // PUT - Duyệt order (Accept)
    @PutMapping("/{orderId}/approve")
    public ApiResponse<ImportOrderResponse> approveOrder(@PathVariable String orderId) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.updateApprove(orderId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // PUT - Từ chối order (Reject)
    @PutMapping("/{orderId}/reject")
    public ApiResponse<ImportOrderResponse> rejectOrder(@PathVariable String orderId) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.updateReject(orderId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // DELETE - Xóa mềm order
    @DeleteMapping("/{orderId}")
    public ApiResponse<ImportOrderResponse> deleteOrder(@PathVariable String orderId) {
        return ApiResponse.<ImportOrderResponse>builder()
                .Result(importOrderService.deleteOrder(orderId))
                .code(0)
                .message("Deleted SuccessFull")
                .success(true)
                .build();
    }
}
