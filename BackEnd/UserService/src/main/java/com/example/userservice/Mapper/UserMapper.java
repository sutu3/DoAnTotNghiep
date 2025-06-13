package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Model.Users;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toEntity(UserRequest request);
    @Mapping(target = "warehouses",ignore = true)
    UserResponse toResponse(Users entity);
/*
    void updateUser(@MappingTarget User entity, AddressUserUpdate update);
*/
}
