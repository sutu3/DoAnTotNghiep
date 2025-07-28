package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.SupplierRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.Supplier.SupplierResponse;
import com.example.userservice.Form.SupplierForm;
import com.example.userservice.Repo.SupplierRepo;
import com.example.userservice.Service.SupplierService;
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
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Supplier API", description = "Quản lý Người dùng ngoài")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/search")
    public ApiResponse<Page<SupplierResponse>> getALl(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<SupplierResponse>>builder()
                .Result(supplierService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/SuppliersName")
    public ApiResponse<List<SupplierResponse>> getALl(
    ){
        return ApiResponse.<List<SupplierResponse>>builder()
                .Result(supplierService.getALlList())
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{supplierId}")
    public ApiResponse<SupplierResponse> getById(
            @PathVariable String supplierId
    ){
        return ApiResponse.<SupplierResponse>builder()
                .Result(supplierService.getByIdResponse(supplierId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<SupplierResponse> createSupplier(@RequestBody SupplierRequest supplierRequest){
        return ApiResponse.<SupplierResponse>builder()
                .Result(supplierService.createSupplier(supplierRequest))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();

    }
    @PutMapping("/update/{supplierId}")
    public ApiResponse<SupplierResponse> updateSupplier(
            @PathVariable String supplierId,
            @RequestBody SupplierForm update
    ){
        return ApiResponse.<SupplierResponse>builder()
                .Result(supplierService.updateSupplier(update,supplierId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/delete/{supplierId}")
    public ApiResponse<SupplierResponse> deleteSupplier(
            @PathVariable String supplierId
    ){
        supplierService.deleteSupplier(supplierId);
        return ApiResponse.<SupplierResponse>builder()
                .code(0)
                .message("Deleted SuccessFull")
                .success(true)
                .build();
    }
}
