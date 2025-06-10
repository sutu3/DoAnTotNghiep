package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Service.WarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class WarehouseController {
    private final WarehouseService warehouseService;

    @GetMapping("/search?page={pageNumber}&size={pageSize}")
    public ApiResponse<Page<WarehousesResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<WarehousesResponse>>builder()
                .Result(warehouseService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();

    }
    @GetMapping("/manager/{id}")
    public ApiResponse<WarehousesResponse> getByManagerId(@PathVariable String id){
        return ApiResponse.<WarehousesResponse>builder()
                .Result(warehouseService.getByManagerId(id))
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
    @GetMapping("/search/?name={warehouseName}")
    public ApiResponse<Page<WarehousesResponse>> getByWarehouseName(
            @RequestParam String warehouseName,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size){
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
}
