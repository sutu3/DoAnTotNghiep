package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.SupplierRequest;
import com.example.userservice.Dto.Responses.Supplier.SupplierResponse;
import com.example.userservice.Form.SupplierForm;
import com.example.userservice.Model.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    Supplier toEntity(SupplierRequest request);
    SupplierResponse toResponse(Supplier supplier);
    void updateSupplier(@MappingTarget Supplier supplier, SupplierForm update);
    void updateSupplierRequest(@MappingTarget Supplier supplier, SupplierRequest request);
}
