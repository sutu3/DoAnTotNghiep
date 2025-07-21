package com.example.productservice.Controller;

import com.example.productservice.Dto.Requests.ProductClientRequest;
import com.example.productservice.Dto.Requests.ProductCreateWrapper;
import com.example.productservice.Dto.Requests.ProductRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Form.ProductForm;
import com.example.productservice.Service.ProductService;
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
@RequestMapping("/api/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Product API", description = "Quản lý sản phẩm")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/search/productPage")
    public ApiResponse<Page<ProductResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<ProductResponse>>builder()
                .Result(productService.getAll(pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search")
    public ApiResponse<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String supplierId,
            @RequestParam(required = false) String warehouseId
    ) {
        return ApiResponse.<List<ProductResponse>>builder()
                .Result(productService.getProductsBySupplierFilteredByWarehouse(supplierId,warehouseId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/groupUnitName/{groupUnitName}/supplierId/{supplierId}")
    public ApiResponse<Page<ProductResponse>> getAllBySupplier(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String supplierId
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<ProductResponse>>builder()
                .Result(productService.getAllBySupplier(supplierId,pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<ProductResponse> save(
            @RequestBody ProductCreateWrapper productRequest){
        return ApiResponse.<ProductResponse>builder()
                .Result(productService.createProduct(productRequest))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PutMapping("/search/productId/{productId}")
    public ApiResponse<ProductResponse> update(
            @PathVariable String productId,
            @RequestBody ProductForm update){
        return ApiResponse.<ProductResponse>builder()
                .Result(productService.updateProduct(update,productId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/productId/{productId}")
    public ApiResponse<ProductResponse> getById(
            @PathVariable String productId){
        return ApiResponse.<ProductResponse>builder()
                .Result(productService.getByIdResponse(productId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @DeleteMapping("/{productId}")
    public ApiResponse<String> delete(@PathVariable String productId){
        productService.deleteByProductId(productId);
        return ApiResponse.<String>builder()
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
