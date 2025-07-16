package com.example.authenservice.Service;

import com.example.authenservice.Dtos.Request.UserRequest;
import com.example.authenservice.Dtos.Response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(String id);
    UserResponse getUserByUsername(String username);
    UserResponse updateUser(String id, UserRequest request);
    UserResponse updateUserRoleManager(String email);
    void deleteUser(String id);
    Page<UserResponse> getAllUsers(Pageable pageable);
}
