package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Form.StackForm;
import com.ddd.warehouse.Service.Impl.StackBinOrchestratorService;
import com.ddd.warehouse.Service.StackService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/api/stacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Stacks API", description = "Quản lý dãy hàng trong kho")

public class StackController {
    StackService stackService;
    private final StackBinOrchestratorService stackBinOrchestratorService;

    @GetMapping("/search")
    public ApiResponse<Page<StackResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<StackResponse>>builder()
                .Result(stackService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/filter")
    public ApiResponse<Page<StackResponse>> getAllByWarehouse(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String stackName,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<StackResponse>>builder()
                .Result(stackService.getAllByWarehouseId(pageable, warehouseId,stackName))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/ByWarehouse/{warehouseId}/list")
    public ApiResponse<List<StackResponse>> getAllByWarehouse(
            @PathVariable String warehouseId
    ){
        return ApiResponse.<List<StackResponse>>builder()
                .Result(stackService.getAllListByWarehouseId(warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/name/{stackName}/warehouse/{warehouse}")
    public ApiResponse<StackResponse> getByStackName(
            @PathVariable String stackName,
            @PathVariable String warehouse
    ){
        return ApiResponse.<StackResponse>builder()
                .Result(stackService.getByStackNameResponse(stackName,warehouse))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{stackid}")
    public ApiResponse<StackResponse> getByStackId(
            @PathVariable String stackid
    ){
        return ApiResponse.<StackResponse>builder()
                .Result(stackService.getByIdResponse(stackid))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<StackResponse> create(@RequestBody @Valid StackRequest stackRequest){
        return ApiResponse.<StackResponse>builder()
                .Result(stackBinOrchestratorService.createStackAndBins(stackRequest))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{stackId}")
    public ApiResponse<StackResponse> updateByStackId(
            @PathVariable String stackId,
            @RequestBody StackForm update
            ){
        return ApiResponse.<StackResponse>builder()
                .Result(stackService.updateStack(update,stackId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/{stackId}")
    public ApiResponse<String> deleteByStackId(@PathVariable String stackId){
        return ApiResponse.<String>builder()
                .Result(stackService.deleteStack(stackId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/by-bin/{binId}")
    public ApiResponse<StackResponse> getStackByBin(@PathVariable String binId) {
        return ApiResponse.<StackResponse>builder()
                .Result(stackBinOrchestratorService.getStackByBinId(binId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
