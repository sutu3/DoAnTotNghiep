package com.example.authenservice.Service;

import com.example.authenservice.Dtos.Request.UpdateRole;
import com.example.authenservice.Dtos.Request.UserRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Dtos.Response.UserResponse;
import com.example.authenservice.Modal.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(String id);
    UserResponse getUserByUsername(String username);
    UserResponse updateUser(String id, UserRequest request);
    @PreAuthorize("hasRole('MANAGER')")
    UserResponse updateUserRoleManager(String email, UpdateRole updateRole);
    void deleteUser(String id);
    Page<UserResponse> getAllUsers(Pageable pageable);
    Set<RoleResponse> getRolesByUserId(String userId);
    List<UserResponse> getAllUserManager();
}
