package com.example.userservice.Mapper;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Model.Users;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toEntity(UserRequest request);
    @Mapping(target = "warehouses",ignore = true)
    UserResponse toResponse(Users entity);
    UserResponse updateWarehouse(@MappingTarget UserResponse entity, WarehousesResponse warehouses);
/*
    void updateUser(@MappingTarget User entity, AddressUserUpdate update);
*/
}
