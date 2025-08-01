package com.example.userservice.Service;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Request.UpdateRole;
import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.IdWarehouseResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    Page<UserResponse> getAllByWarehouseId(String warehouseId,Pageable pageable);
    Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable);
    IdWarehouseResponse getWarehouseByIdUser();
    @PreAuthorize("hasRole('MANAGER')")
    UserResponse CreateUser(UserRequest request);
    @PreAuthorize("hasRole('MANAGER')")
    UserResponse UpdateRoleUser(String userId, UpdateRole updateRole);
    String DeletedUser(String id);
    Users findById(String id);
    UserResponse getByIdResponse(String id);
    UserResponse findByEmail(String email);
    UserResponse getByUserId();
    UserResponse enrich(Users users);
    List<UserResponse> getActiveUsersByWarehouse(String warehouseId);

}
