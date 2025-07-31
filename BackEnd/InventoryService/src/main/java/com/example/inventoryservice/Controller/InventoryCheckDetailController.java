package com.example.inventoryservice.Controller;

import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Request.InventoryCheckDetailRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckDetailResponse;
import com.example.inventoryservice.Form.InventoryCheckDetailForm;
import com.example.inventoryservice.Service.InventoryCheckDetailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/check-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Inventory Check Detail API", description = "Quản lý chi tiết phiếu kiểm kho")
public class InventoryCheckDetailController {

    InventoryCheckDetailService inventoryCheckDetailService;

    @GetMapping("/check-sheet/{checkSheetId}")
    public ApiResponse<List<InventoryCheckDetailResponse>> getAllByCheckSheetId(@PathVariable String checkSheetId) {
        return ApiResponse.<List<InventoryCheckDetailResponse>>builder()
                .Result(inventoryCheckDetailService.getAllByCheckSheetId(checkSheetId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<InventoryCheckDetailResponse> getById(@PathVariable String id) {
        return ApiResponse.<InventoryCheckDetailResponse>builder()
                .Result(inventoryCheckDetailService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @PostMapping("/check-sheet/{checkSheetId}")
    public ApiResponse<InventoryCheckDetailResponse> createInventoryCheckDetail(
            @PathVariable String checkSheetId,
            @RequestBody InventoryCheckDetailRequest request
    ) {
        return ApiResponse.<InventoryCheckDetailResponse>builder()
                .Result(inventoryCheckDetailService.createInventoryCheckDetail(request, checkSheetId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<InventoryCheckDetailResponse> updateInventoryCheckDetail(
            @PathVariable String id,
            @RequestBody InventoryCheckDetailForm update
    ) {
        return ApiResponse.<InventoryCheckDetailResponse>builder()
                .Result(inventoryCheckDetailService.updateInventoryCheckDetail(update, id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteInventoryCheckDetail(@PathVariable String id) {
        inventoryCheckDetailService.deleteInventoryCheckDetail(id);
        return ApiResponse.<String>builder()
                .Result("Deleted Successfully")
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/check-sheet/{checkSheetId}/discrepancies")
    public ApiResponse<List<InventoryCheckDetailResponse>> getDiscrepancies(@PathVariable String checkSheetId) {
        return ApiResponse.<List<InventoryCheckDetailResponse>>builder()
                .Result(inventoryCheckDetailService.getDiscrepanciesByCheckSheetId(checkSheetId)
                        .stream()
                        .map(inventoryCheckDetailService::enrich)
                        .toList())
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    @GetMapping("/check-sheet/{checkSheetId}/total-discrepancy")
    public ApiResponse<BigDecimal> getTotalDiscrepancy(@PathVariable String checkSheetId) {
        return ApiResponse.<BigDecimal>builder()
                .Result(inventoryCheckDetailService.getTotalDiscrepancyByCheckSheetId(checkSheetId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
