package com.example.userservice.Service;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    Page<UserResponse> getAllByWarehouseId(String warehouseId,Pageable pageable);
    Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable);
    UserResponse CreateUser(UserRequest request);
    String DeletedUser(String id);
    Users findById(String id);
    UserResponse findByEmail(String email);
    UserResponse getByUserId(String id);
    UserResponse enrich(Users users);
}
