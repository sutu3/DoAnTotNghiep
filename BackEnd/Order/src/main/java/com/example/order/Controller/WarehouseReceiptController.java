package com.example.order.Controller;

import com.example.order.Dto.Request.ReceiptItemRequest;
import com.example.order.Dto.Request.WarehouseReceiptRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.ReceiptItem.ReceiptItemResponse;
import com.example.order.Dto.Response.WarehouseReceipt.WarehouseReceiptResponse;
import com.example.order.Service.WarehouseReceiptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse-receipts")
@RequiredArgsConstructor
@Slf4j
public class WarehouseReceiptController {

    private final WarehouseReceiptService warehouseReceiptService;

    @PostMapping
    public ApiResponse<WarehouseReceiptResponse> createReceipt(
            @RequestBody @Valid WarehouseReceiptRequest request) {
        return ApiResponse.<WarehouseReceiptResponse>builder()
                .Result(warehouseReceiptService.createReceipt(request))
                .code(0)
                .message("Warehouse receipt created successfully")
                .success(true)
                .build();
    }

    @GetMapping("/{receiptId}")
    public ApiResponse<WarehouseReceiptResponse> getReceipt(@PathVariable String receiptId) {
        return ApiResponse.<WarehouseReceiptResponse>builder()
                .Result(warehouseReceiptService.getByIdResponse(receiptId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @PutMapping("/{receiptId}/items/{receiptItemId}")
    public ApiResponse<WarehouseReceiptResponse> updateReceiptItem(
            @PathVariable String receiptId,
            @PathVariable String receiptItemId,
            @RequestBody ReceiptItemRequest request
    ) {
        return ApiResponse.<WarehouseReceiptResponse>builder()
                .Result(warehouseReceiptService.updateReceiptItem(receiptId, receiptItemId, request))
                .code(0)
                .message("Receipt item updated successfully")
                .success(true)
                .build();
    }
    @GetMapping("/search/order/{orderId}")
    public ApiResponse<List<WarehouseReceiptResponse>> getReceiptsByOrder(@PathVariable String orderId) {
        return ApiResponse.<List<WarehouseReceiptResponse>>builder()
                .Result(warehouseReceiptService.getByOrderId(orderId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search")
    public ApiResponse<Page<WarehouseReceiptResponse>> getReceiptsByWarehouse(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String receiptId,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size)
    {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<WarehouseReceiptResponse>>builder()
                .Result(warehouseReceiptService.getAllByWarehouseId(warehouseId,status,receiptId,pageable))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @PutMapping("/{receiptId}/complete")
    public ApiResponse<Void> completeReceipt(@PathVariable String receiptId) {
        warehouseReceiptService.completeReceipt(receiptId);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Receipt completed successfully")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouseReceipt/{receiptId}")
    public ApiResponse<List<ReceiptItemResponse>> getById(@PathVariable String receiptId){
        return ApiResponse.<List<ReceiptItemResponse>>builder()
                .Result(warehouseReceiptService.getAllReceiptItemsByReceiptId(receiptId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

}
