package com.example.authenservice.Mapper;

import com.example.authenservice.Dtos.Request.UserRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Dtos.Response.UserResponse;
import com.example.authenservice.Modal.Role;
import com.example.authenservice.Modal.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(mapRolesToResponse(user.getRoles()))")
    UserResponse toResponse(User user);

    @Mapping(target = "idUser", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserRequest request);


    default Set<RoleResponse> mapRolesToResponse(Set<Role> roles) {
        if (roles == null) return Collections.emptySet();
        return roles.stream()
                .map(role -> RoleResponse.builder()
                        .roleName(role.getRoleName())
                        .description(role.getDescription())
                        .build())
                .collect(Collectors.toSet());
    }
}
