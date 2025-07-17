package com.example.order.Controller;

import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Form.UpdateBinRequest;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Form.UpdateQuantityRequest;
import com.example.order.Service.ExportItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exportItems")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Export Item API", description = "Quản lý các item trong đơn xuất hàng")
public class ExportItemController {

    ExportItemService exportItemService;

    @GetMapping("/search/orderId/{orderId}")
    public ApiResponse<List<ExportItemResponse>> getAllByOrderId(
            @PathVariable String orderId
    ) {
        return ApiResponse.<List<ExportItemResponse>>builder()
                .Result(exportItemService.getAllByOrder(orderId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/search/warehouseId/{warehouseId}")
    public ApiResponse<Page<ExportItemResponse>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ExportItemResponse>>builder()
                .Result(exportItemService.getAllByWarehouse(pageable, warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @GetMapping("/search/itemId/{itemId}")
    public ApiResponse<ExportItemResponse> getById(@PathVariable String itemId) {
        return ApiResponse.<ExportItemResponse>builder()
                .Result(exportItemService.getByIdResponse(itemId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }

    @PostMapping
    public ApiResponse<ExportItemResponse> createItem(@RequestBody ExportItemRequest request) {
        return ApiResponse.<ExportItemResponse>builder()
                .Result(exportItemService.createItem(request))
                .code(0)
                .message("Export item created successfully")
                .success(true)
                .build();
    }

    @PostMapping("/batch")
    public ApiResponse<List<ExportItemResponse>> createItems(@RequestBody List<ExportItemRequest> requests) {
        return ApiResponse.<List<ExportItemResponse>>builder()
                .Result(exportItemService.createItems(requests))
                .code(0)
                .message("Export items created successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{itemId}")
    public ApiResponse<ExportItemResponse> updateItem(
            @PathVariable String itemId,
            @RequestBody UpdateExportItemForm update
    ) {
        return ApiResponse.<ExportItemResponse>builder()
                .Result(exportItemService.updateItem(update, itemId))
                .code(0)
                .message("Export item updated successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{itemId}/quantity")
    public ApiResponse<ExportItemResponse> updateQuantity(
            @PathVariable String itemId,
            @RequestBody UpdateQuantityRequest request
    ) {
        return ApiResponse.<ExportItemResponse>builder()
                .Result(exportItemService.updateQuantity(itemId, request.realityQuantity()))
                .code(0)
                .message("Quantity updated successfully")
                .success(true)
                .build();
    }

    @PutMapping("/{itemId}/bin")
    public ApiResponse<ExportItemResponse> updateBinLocation(
            @PathVariable String itemId,
            @RequestBody UpdateBinRequest request
    ) {
        return ApiResponse.<ExportItemResponse>builder()
                .Result(exportItemService.updateBinLocation(itemId, request.binId()))
                .code(0)
                .message("Bin location updated successfully")
                .success(true)
                .build();
    }

    @PostMapping("/{orderId}/execute-export")
    public ApiResponse<Void> executeExport(
            @PathVariable String orderId,
            @RequestBody List<ExportItemResponse> items
    ) {
        exportItemService.executeExport(orderId, items);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Export executed successfully")
                .success(true)
                .build();
    }

    @DeleteMapping("/{itemId}")
    public ApiResponse<String> deleteItem(@PathVariable String itemId) {
        exportItemService.deleteItem(itemId);
        return ApiResponse.<String>builder()
                .code(0)
                .message("Export item deleted successfully")
                .success(true)
                .build();
    }
}
