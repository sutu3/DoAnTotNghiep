package com.example.inventoryservice.Controller;

import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Request.InventoryCheckSheetRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckSheetResponse;
import com.example.inventoryservice.Form.InventoryCheckSheetForm;
import com.example.inventoryservice.Service.InventoryCheckSheetService;
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
@RequestMapping("/api/inventory/check-sheets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Inventory Check Sheet API", description = "Quản lý phiếu kiểm kho")
public class InventoryCheckSheetController {

    InventoryCheckSheetService inventoryCheckSheetService;

    @GetMapping("/warehouse/{warehouseId}")
    public ApiResponse<Page<InventoryCheckSheetResponse>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<InventoryCheckSheetResponse>>builder()
                .Result(inventoryCheckSheetService.getAllByWarehouse(pageable, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/performed-by/{performedBy}")
    public ApiResponse<List<InventoryCheckSheetResponse>> getAllByPerformedBy(@PathVariable String performedBy) {
        return ApiResponse.<List<InventoryCheckSheetResponse>>builder()
                .Result(inventoryCheckSheetService.getAllByPerformedBy(performedBy))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<InventoryCheckSheetResponse> getById(@PathVariable String id) {
        return ApiResponse.<InventoryCheckSheetResponse>builder()
                .Result(inventoryCheckSheetService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @PostMapping
    public ApiResponse<InventoryCheckSheetResponse> createInventoryCheckSheet(
            @RequestBody InventoryCheckSheetRequest request
    ) {
        return ApiResponse.<InventoryCheckSheetResponse>builder()
                .Result(inventoryCheckSheetService.createInventoryCheckSheet(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<InventoryCheckSheetResponse> updateInventoryCheckSheet(
            @PathVariable String id,
            @RequestBody InventoryCheckSheetForm form
    ) {
        return ApiResponse.<InventoryCheckSheetResponse>builder()
                .Result(inventoryCheckSheetService.updateInventoryCheckSheet(form, id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteInventoryCheckSheet(@PathVariable String id) {
        inventoryCheckSheetService.deleteInventoryCheckSheet(id);
        return ApiResponse.<String>builder()
                .Result("Deleted Successfully")
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/date-range")
    public ApiResponse<List<InventoryCheckSheetResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ApiResponse.<List<InventoryCheckSheetResponse>>builder()
                .Result(inventoryCheckSheetService.getByDateRange(startDate, endDate))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @PostMapping("/{id}/process")
    public ApiResponse<InventoryCheckSheetResponse> processCheckSheet(@PathVariable String id) {
        return ApiResponse.<InventoryCheckSheetResponse>builder()
                .Result(inventoryCheckSheetService.processCheckSheet(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
