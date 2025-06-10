package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Module.Warehouses;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface WarehouseMapper {
    Warehouses toEntity(WarehousesRequest request);

    WarehousesResponse toResponse(Warehouses Entity);
    void update(@MappingTarget Warehouses entity, WarehousesForm update);
    void updateAddress(@MappingTarget Warehouses entity, AddressForm update);

}
