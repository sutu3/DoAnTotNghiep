package com.example.order.Controller;

import com.example.order.Dto.Request.DeliveryItemRequest;
import com.example.order.Dto.Request.WarehouseDeliveryRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.DeliveryItem.DeliveryItemResponse;
import com.example.order.Dto.Response.WarehouseDelivery.WarehouseDeliveryResponse;
import com.example.order.Enum.DeliveryStatus;
import com.example.order.Service.WarehouseDeliveryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse-deliveries")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Warehouse Delivery API", description = "Quản lý phiếu xuất kho")
public class WarehouseDeliveryController {

    private final WarehouseDeliveryService warehouseDeliveryService;

    @PostMapping
    public ApiResponse<WarehouseDeliveryResponse> createDelivery(
            @RequestBody @Valid WarehouseDeliveryRequest request) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.createDelivery(request))
                .code(0)
                .message("Warehouse delivery created successfully")
                .success(true)
                .build();
    }

    @GetMapping("/{deliveryId}")
    public ApiResponse<WarehouseDeliveryResponse> getDelivery(@PathVariable String deliveryId) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.getByIdResponse(deliveryId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/getAllPage")
    public ApiResponse<Page<WarehouseDeliveryResponse>> getAllByStatus(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String warehouseId,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<WarehouseDeliveryResponse>>builder()
                .Result(warehouseDeliveryService.getByStatusAndWarehouse(warehouseId, status, pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/search/order/{orderId}")
    public ApiResponse<List<WarehouseDeliveryResponse>> getDeliveriesByOrder(@PathVariable String orderId) {
        return ApiResponse.<List<WarehouseDeliveryResponse>>builder()
                .Result(warehouseDeliveryService.getByOrderId(orderId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/search/warehouse/{warehouseId}")
    public ApiResponse<List<WarehouseDeliveryResponse>> getDeliveriesByWarehouse(@PathVariable String warehouseId) {
        return ApiResponse.<List<WarehouseDeliveryResponse>>builder()
                .Result(warehouseDeliveryService.getAllByWarehouseId(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/deliveryId/{deliveryId}")
    public ApiResponse<List<DeliveryItemResponse>> getDeliveriesItemByDeliveríesId(@PathVariable String deliveryId) {
        return ApiResponse.<List<DeliveryItemResponse>>builder()
                .Result(warehouseDeliveryService.getDeliveryItems(deliveryId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @PostMapping("/{deliveryId}/items")
    public ApiResponse<WarehouseDeliveryResponse> addDeliveryItem(
            @PathVariable String deliveryId,
            @RequestBody @Valid DeliveryItemRequest request) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.addDeliveryItem(deliveryId, request))
                .code(0)
                .message("Delivery item added successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{deliveryId}/items/{deliveryItemId}")
    public ApiResponse<WarehouseDeliveryResponse> updateDeliveryItem(
            @PathVariable String deliveryId,
            @PathVariable String deliveryItemId,
            @RequestBody @Valid DeliveryItemRequest request) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.updateDeliveryItem(deliveryId, deliveryItemId, request))
                .code(0)
                .message("Delivery item updated successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{deliveryId}/status")
    public ApiResponse<WarehouseDeliveryResponse> updateDeliveryStatus(
            @PathVariable String deliveryId,
            @RequestParam DeliveryStatus status) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.updateDeliveryStatus(deliveryId, status))
                .code(0)
                .message("Delivery status updated successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{deliveryId}/complete")
    public ApiResponse<WarehouseDeliveryResponse> completeDelivery(@PathVariable String deliveryId) {
        return ApiResponse.<WarehouseDeliveryResponse>builder()
                .Result(warehouseDeliveryService.completeDelivery(deliveryId))
                .code(0)
                .message("Delivery completed successfully")
                .success(true)
                .build();
    }

    @DeleteMapping("/{deliveryId}")
    public ApiResponse<Void> deleteDelivery(@PathVariable String deliveryId) {
        warehouseDeliveryService.deleteDelivery(deliveryId);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Delivery deleted successfully")
                .success(true)
                .build();
    }
}
