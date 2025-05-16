package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.CategoryRequest;
import com.ddd.warehouse.Dto.Response.Category.CategoryResponse;
import com.ddd.warehouse.Form.CategoryUpdate;
import com.ddd.warehouse.Module.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryRequest request);
    CategoryResponse toResponse(Category entity);
    void updateCategory(@MappingTarget Category entity, CategoryUpdate update);
}
