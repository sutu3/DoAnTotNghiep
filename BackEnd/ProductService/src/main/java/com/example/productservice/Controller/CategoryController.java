package com.example.productservice.Controller;

import com.example.productservice.Dto.Requests.CategoryRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.Category.CategoryNameResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponse;
import com.example.productservice.Form.CategoryForm;
import com.example.productservice.Service.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Category API", description = "Quản lý thể loại sản phẩm")
public class CategoryController {
    CategoryService categoryService;
    @GetMapping("/search")
    public ApiResponse<Page<CategoryResponse>> getAllByWarehouseId(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size) {
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<CategoryResponse>>builder()
                .Result(categoryService.getAll(pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/categoryId/{categoryId}")
    public ApiResponse<CategoryResponse> getByCategoryId(
            @PathVariable String categoryId
    ) {
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.getByIdResponse(categoryId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/categoryNames")
    public ApiResponse<List<CategoryNameResponse>> getByWarehouseId(
            ) {
        return ApiResponse.<List<CategoryNameResponse>>builder()
                .Result(categoryService.getAllCategoryName())
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/categoryName/{categoryName}")
    public ApiResponse<CategoryResponse> getByWarehouseIdAndCategoryName(
            @PathVariable String categoryName) {
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.getByNameResponse(categoryName))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.createCategory(request))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PutMapping("/search/categoryId/{categoryId}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable String categoryId,
            @RequestBody CategoryForm update
            ) {
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.updateCategory(update,categoryId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @DeleteMapping("/{categoryId}")
    public ApiResponse<String> deleteCategory(
            @PathVariable String categoryId
    ){
        categoryService.DeleteCategory(categoryId);
        return ApiResponse.<String>builder()
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
