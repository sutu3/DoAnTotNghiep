package com.example.userservice.Mapper;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Form.TaskTypeForm;
import com.example.userservice.Model.TaskType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaskTypeMapper {
    @Mapping(target = "warehouses",ignore = true)
    TaskType toEntity(TaskTypeRequest request);
    @Mapping(target = "warehouses",ignore = true)
    TaskTypeResponse toResponse(TaskType entity);
    @Mapping(target = "warehouses",ignore = true)
    void update(@MappingTarget TaskType entity, TaskTypeForm update);

    TaskTypeResponse updateWarehouse(@MappingTarget TaskTypeResponse entity, WarehousesResponse warehouses);
}
