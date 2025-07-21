package com.example.authenservice.Mapper;

import com.example.authenservice.Dtos.Request.RoleRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Modal.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse toResponse(Role role);
    Role toEntity(RoleRequest roleRequest);
}
