package com.example.userservice.Mapper;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Form.TaskForm;
import com.example.userservice.Model.Tasks;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "taskType",ignore = true)
    @Mapping(target = "warehouses",ignore = true)
    @Mapping(source = "completeAt", target = "completeAt", qualifiedByName = "mapToLocalDateTime")
    Tasks toEntity(TaskRequest request);
    @Mapping(target = "warehouses",ignore = true)
    TaskResponse toResponse(Tasks task);
    @Mapping(target = "taskType",ignore = true)
    @Mapping(target = "warehouses",ignore = true)
    void update(@MappingTarget Tasks entity, TaskForm update);
    TaskResponse updateWarehouse(@MappingTarget TaskResponse entity, WarehousesResponse warehouses);

    @Named("mapToLocalDateTime")
    static LocalDateTime mapToLocalDateTime(LocalDate date) {
        return date != null ? date.atStartOfDay() : null;
    }
}
