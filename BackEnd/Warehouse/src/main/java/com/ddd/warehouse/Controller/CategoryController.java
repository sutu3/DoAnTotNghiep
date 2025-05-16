package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.CategoryRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Category.CategoryResponse;
import com.ddd.warehouse.Form.CategoryUpdate;
import com.ddd.warehouse.Service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorys")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CategoryController {
    CategoryService categoryService;
    @GetMapping("/getAll")
    public ApiResponse<List<CategoryResponse>> getall(){
        return ApiResponse.<List<CategoryResponse>>builder()
                .Result(categoryService.getall())
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(@PathVariable String id){
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.findById(id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @PostMapping("/create")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request){
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.createCategory(request))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @PutMapping("/update/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@RequestBody CategoryUpdate update,@RequestParam String id){
        return ApiResponse.<CategoryResponse>builder()
                .Result(categoryService.updateCategory(update,id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteById(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(categoryService.deletedCategory(id))
                .message("Delete SuccessFull")
                .success(true)
                .code(0).build();
    }
}
