package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Form.BinForm;
import com.ddd.warehouse.Service.BinService;
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
@RequestMapping("/api/bins")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Bins API", description = "Quản lý ô chứa trong kho")
public class BinController {
    BinService binService;

    @GetMapping("/search")
    public ApiResponse<Page<BinResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BinResponse>>builder()
                .Result(binService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("search/binId/{binId}")
    public ApiResponse<BinResponse> getById(
            @PathVariable String binId
    ){
        return ApiResponse.<BinResponse>builder()
                .Result(binService.getByIdResponse(binId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
//    @PostMapping
//    public ApiResponse<BinResponse> save(@RequestBody BinRequest binRequest){
//        return ApiResponse.<BinResponse>builder()
//                .Result(binService.createBin(binRequest))
//                .code(0)
//                .message("SuccessFull")
//                .success(true)
//                .build();
//    }
    @GetMapping("/search/byStackName/{stackName}")
    public ApiResponse<Page<BinResponse>> getBinByCode(
            @PathVariable String stackName,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BinResponse>>builder()
                .Result(binService.getAllByStackName(pageable,stackName))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/byBinCode/{code}")
    public ApiResponse<BinResponse> getBinByCode(
            @PathVariable String code,
            @RequestParam("stackName") String stack,
            @RequestParam("wareHouseId") String warehouse
    ){
        return ApiResponse.<BinResponse>builder()
                .Result(binService.getByBinCodeResponse(code,stack,warehouse))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/byWarehouse/{warehouseId}")
    public ApiResponse<Page<BinResponse>> getAllBinByWarehouseId(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BinResponse>>builder()
                .Result(binService.getAllByWarehouseId(pageable,warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/byWarehouse/{warehouseId}/list")
    public ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(
            @PathVariable String warehouseId
    ){
        return ApiResponse.<List<BinResponse>>builder()
                .Result(binService.getAllListByWarehouseId(warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<BinResponse> updateBin(
            @PathVariable String id,
            @RequestBody BinForm update
    ){
        return ApiResponse.<BinResponse>builder()
                .Result(binService.updateBin(update,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteBin(
            @PathVariable String id
    ){
        return ApiResponse.<String >builder()
                .Result(binService.deleteBin(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
