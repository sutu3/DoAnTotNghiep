package com.example.productservice.Mapper;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Dto.Requests.ProductClientRequest;
import com.example.productservice.Dto.Requests.ProductRequest;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Form.ProductForm;
import com.example.productservice.Model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "unit",ignore = true)
    @Mapping(target = "category",ignore = true)
    Product toEntity(ProductRequest request);
    @Mapping(target = "category",ignore = true)
    @Mapping(target = "unit",ignore = true)
    ProductClientRequest toClientRequest(Product product);
    @Mapping(target = "createByUser",ignore = true)
    @Mapping(target = "supplier",ignore = true)
    ProductResponse toResponse(Product product);
    @Mapping(target = "unit",ignore = true)
    @Mapping(target = "category",ignore = true)
    void updateResquest(@MappingTarget Product product,ProductRequest request);
    @Mapping(target = "unit",ignore = true)
    @Mapping(target = "category",ignore = true)
    void update(@MappingTarget Product product, ProductForm update);
}
