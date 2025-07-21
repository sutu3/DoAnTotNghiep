package com.example.productservice.Service;

import com.example.productservice.Dto.Requests.CategoryRequest;
import com.example.productservice.Dto.Responses.Category.CategoryNameResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponse;
import com.example.productservice.Form.CategoryForm;
import com.example.productservice.Model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    Page<CategoryResponse> getAll(Pageable pageable);
    List<CategoryNameResponse> getAllCategoryName();
    Category getByName(String name);
    CategoryResponse getByNameResponse(String name);
    @PreAuthorize("hasRole('MANAGER')")
    CategoryResponse createCategory(CategoryRequest request);
    void DeleteCategory(String id);
    Category getById(String id);
    CategoryResponse getByIdResponse(String id);
    @PreAuthorize("hasRole('MANAGER')")
    CategoryResponse updateCategory(CategoryForm update,String id);
    CategoryResponse enrich(Category category);
}
