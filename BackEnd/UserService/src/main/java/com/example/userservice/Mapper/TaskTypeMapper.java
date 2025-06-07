package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Form.TaskTypeForm;
import com.example.userservice.Model.TaskType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaskTypeMapper {
    TaskType toEntity(TaskTypeRequest request);
    TaskTypeResponse toResponse(TaskType entity);
    void update(@MappingTarget TaskType entity, TaskTypeForm update);
}
