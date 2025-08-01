package com.example.productservice.Mapper;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Dto.Requests.CategoryRequest;
import com.example.productservice.Dto.Responses.Category.CategoryNameResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponse;
import com.example.productservice.Form.CategoryForm;
import com.example.productservice.Model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toEntity(CategoryRequest request);

    @Mapping(target = "createByUser", ignore = true)
    CategoryResponse toResponse(Category category);

    CategoryNameResponse toNameResponse(Category category);
    void update(@MappingTarget Category category, CategoryForm categoryUpdate);
}
