package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Model.TaskUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = TaskMapper.class)
public interface TaskUserMapper {
    @Mapping(target = "user",ignore = true)
    @Mapping(target = "task",ignore = true)
    TaskUser toEntity(TaskUserRequest request);
    @Mapping(target = "user.warehouses",ignore = true)
    TaskUserResponse toResponse(TaskUser entity);
   /* void update(@MappingTarget TaskUser entity, TaskUserForm update);*/
}
