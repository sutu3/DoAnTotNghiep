package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Form.TaskForm;
import com.example.userservice.Model.Tasks;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "taskType",ignore = true)
    Tasks toEntity(TaskRequest request);
    TaskResponse toResponse(Tasks entity);
    @Mapping(target = "taskType",ignore = true)
    void update(@MappingTarget Tasks entity, TaskForm update);
}
