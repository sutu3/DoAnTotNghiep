package com.example.userservice.Mapper;

import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Model.Users;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toEntity(UserRequest request);
    UserResponse toResponse(Users entity);
/*
    void updateUser(@MappingTarget User entity, AddressUserUpdate update);
*/
}
