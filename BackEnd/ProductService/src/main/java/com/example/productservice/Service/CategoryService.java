package com.example.productservice.Service;

import com.example.productservice.Dto.Requests.CategoryRequest;
import com.example.productservice.Dto.Responses.Category.CategoryNameResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponse;
import com.example.productservice.Form.CategoryForm;
import com.example.productservice.Model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Page<CategoryResponse> getAllByWarehouseId(Pageable pageable,String warehouses);
    List<CategoryNameResponse> getAllCategoryName(String warehouses);
    Category getByName(String name, String warehouses);
    CategoryResponse getByNameResponse(String name,String warehouses);
    CategoryResponse createCategory(CategoryRequest request);
    void DeleteCategory(String id);
    Category getById(String id);
    CategoryResponse getByIdResponse(String id);
    CategoryResponse updateCategory(CategoryForm update,String id);

}
