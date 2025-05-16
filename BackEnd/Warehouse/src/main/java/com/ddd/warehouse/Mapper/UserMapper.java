package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.UserRequest;
import com.ddd.warehouse.Dto.Response.User.UserResponse;
import com.ddd.warehouse.Module.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequest request);
    UserResponse toResponse(User entity);
/*
    void updateUser(@MappingTarget User entity, AddressUserUpdate update);
*/
}
