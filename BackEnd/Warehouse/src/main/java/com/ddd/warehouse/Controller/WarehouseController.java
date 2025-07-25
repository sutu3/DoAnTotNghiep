package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Stack.NearFullStacksResponse;
import com.ddd.warehouse.Dto.Response.Warehouse.*;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Service.WarehouseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Warehouses API", description = "Quản lý kho")

public class WarehouseController {
    private final WarehouseService warehouseService;

    @GetMapping("/search")
    public ApiResponse<Page<WarehousesResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Sort.Direction soft= Sort.Direction.ASC;
        Sort sortBy=Sort.by(soft,"warehouseId");
        Pageable pageable = PageRequest.of(page, size, sortBy);
        return ApiResponse.<Page<WarehousesResponse>>builder()
                .Result(warehouseService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();

    }
    @GetMapping("/{warehouseId}/capacity")
    public ApiResponse<WarehouseCapacityResponse> getWarehouseCapacity(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<WarehouseCapacityResponse>builder()
                .Result(warehouseService.getWarehouseCapacity(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/getList")
    public ApiResponse<List<WarehousesResponse>> getAllList(
    ){
        return ApiResponse.<List<WarehousesResponse>>builder()
                .Result(warehouseService.getAllList())
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();

    }
    @GetMapping("/{warehouseId}/near-full-stacks")
    public ApiResponse<NearFullStacksResponse> getNearFullStacks(
            @PathVariable String warehouseId,
            @RequestParam(defaultValue = "90") Integer threshold
    ) {
        return ApiResponse.<NearFullStacksResponse>builder()
                .Result(warehouseService.getNearFullStacks(warehouseId, threshold))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/{warehouseId}/capacity-stats")
    public ApiResponse<WarehouseCapacityStatsResponse> getWarehouseCapacityStats(
            @PathVariable String warehouseId,
            @RequestParam(defaultValue = "today") String timeFilter
    ) {
        return ApiResponse.<WarehouseCapacityStatsResponse>builder()
                .Result(warehouseService.getCapacityStats(warehouseId, timeFilter))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/{warehouseId}/storage-alerts")
    public ApiResponse<List<StorageAlertResponse>> getStorageAlerts(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<StorageAlertResponse>>builder()
                .Result(warehouseService.getStorageAlerts(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/{warehouseId}/stack-capacity-details")
    public ApiResponse<List<StackCapacityDetailResponse>> getStackCapacityDetails(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<StackCapacityDetailResponse>>builder()
                .Result(warehouseService.getStackCapacityDetails(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("search/byManager/{id}")
    public ApiResponse<WarehousesResponse> getByManagerId(@PathVariable String id){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.getByManagerId(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("search/byStaff")
    public ApiResponse<WarehousesResponse> getByStaffId(){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.getByStaffId())
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<WarehousesResponse> getById(@PathVariable String id){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/byName")
    public ApiResponse<Page<WarehousesResponse>> getByWarehouseName(
            @RequestParam ("warehouseName") String warehouseName,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size){
        log.debug("page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<WarehousesResponse>>builder()
                .Result(warehouseService.getByName(warehouseName, pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<WarehousesResponse> createWarehouse(@RequestBody WarehousesRequest request){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.createWarehouse(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{warehouseId}")
    public ApiResponse<WarehousesResponse> updateWarehouse(
            @PathVariable String warehouseId,
            @RequestBody WarehousesForm update){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.updateWarehouse(warehouseId, update))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{warehouseId}/address")
    public ApiResponse<WarehousesResponse> updateWarehouseAddress(
            @PathVariable String warehouseId,
            @RequestBody AddressForm form){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.updateAddress(form, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/{warehouseId}")
    public ApiResponse<String> deleteWarehouse(@PathVariable String warehouseId){
        return ApiResponse.<String>builder()
                .Result(warehouseService.deleteWarehouse(warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
