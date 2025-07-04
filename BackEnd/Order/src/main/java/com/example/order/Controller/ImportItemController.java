package com.example.order.Controller;

import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Form.ImportItemForm;
import com.example.order.Service.ImportItemService;
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
@RequestMapping("/api/importItems")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Import Item API", description = "Quản lý các item trong sản phẩm ")
public class ImportItemController {
    ImportItemService importItemService;
    // GET - Lấy tất cả items theo orderId
//    @GetMapping("/search/order/{orderId}")
//    public ApiResponse<Page<ImportOrderItemResponse>> getAllByOrderId(
//            @RequestParam("pageNumber") int page,
//            @RequestParam("pageSize") int size,
//            @PathVariable String orderId
//    ) {
//        Pageable pageable = PageRequest.of(page, size);
//        return ApiResponse.<Page<ImportOrderItemResponse>>builder()
//                .Result(importOrderItemService.getAllByOrderId(pageable, orderId))
//                .code(0)
//                .message("SuccessFull")
//                .success(true)
//                .build();
//    }

    // GET - Lấy items theo warehouse
    @GetMapping("/search/warehouseId/{warehouseId}")
    public ApiResponse<Page<ImportResponseItem>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ImportResponseItem>>builder()
                .Result(importItemService.getAllByWarehouse(pageable, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // GET - Lấy item theo ID
    @GetMapping("/search/itemId/{itemId}")
    public ApiResponse<ImportResponseItem> getById(@PathVariable String itemId) {
        return ApiResponse.<ImportResponseItem>builder()
                .Result(importItemService.getByIdResponse(itemId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // POST - Tạo item mới
    @PostMapping
    public ApiResponse<ImportResponseItem> createItem(@RequestBody ImportRequestItem request) {
        return ApiResponse.<ImportResponseItem>builder()
                .Result(importItemService.createItem(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // POST - Tạo nhiều items cùng lúc
    @PostMapping("/batch")
    public ApiResponse<List<ImportResponseItem>> createItems(@RequestBody List<ImportRequestItem> requests) {
        return ApiResponse.<List<ImportResponseItem>>builder()
                .Result(importItemService.createItems(requests))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    // PUT - Cập nhật item
    @PutMapping("/{itemId}")
    public ApiResponse<ImportResponseItem> updateItem(
            @PathVariable String itemId,
            @RequestBody ImportItemForm update
    ) {
        return ApiResponse.<ImportResponseItem>builder()
                .Result(importItemService.updateItem(update, itemId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

//    // PUT - Cập nhật số lượng thực nhập
//    @PutMapping("/{itemId}/reality-quantity")
//    public ApiResponse<ImportOrderItemResponse> updateRealityQuantity(
//            @PathVariable String itemId,
//            @RequestBody UpdateQuantityRequest request
//    ) {
//        return ApiResponse.<ImportOrderItemResponse>builder()
//                .Result(importOrderItemService.updateRealityQuantity(itemId, request))
//                .code(0)
//                .message("SuccessFull")
//                .success(true)
//                .build();
//    }
//
//    // PUT - Cập nhật bin location
//    @PutMapping("/{itemId}/bin")
//    public ApiResponse<ImportOrderItemResponse> updateBinLocation(
//            @PathVariable String itemId,
//            @RequestBody UpdateBinRequest request
//    ) {
//        return ApiResponse.<ImportOrderItemResponse>builder()
//                .Result(importOrderItemService.updateBinLocation(itemId, request))
//                .code(0)
//                .message("SuccessFull")
//                .success(true)
//                .build();
//    }

    // DELETE - Xóa mềm item
    @DeleteMapping("/{itemId}")
    public ApiResponse<String> deleteItem(@PathVariable String itemId) {
        importItemService.deleteItem(itemId);
        return ApiResponse.<String>builder()
                .code(0)
                .message("Deleted SuccessFull")
                .success(true)
                .build();
    }

}
