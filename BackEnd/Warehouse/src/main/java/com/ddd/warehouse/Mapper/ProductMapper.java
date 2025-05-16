package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.ProductRequest;
import com.ddd.warehouse.Dto.Response.Product.ProductResponse;
import com.ddd.warehouse.Dto.Response.Product.ProductUpdate;
import com.ddd.warehouse.Module.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "category",ignore = true)
    Product toEntity(ProductRequest request);
    ProductResponse toResponse(Product entity);
    void updateProduct(@MappingTarget Product entity, ProductUpdate update);
}
