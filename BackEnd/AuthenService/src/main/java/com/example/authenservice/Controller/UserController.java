package com.example.authenservice.Controller;

import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Dtos.Request.UserRequest;
import com.example.authenservice.Dtos.Response.UserResponse;
import com.example.authenservice.Service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/authen/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "User Authen API", description = "Quản lý người dùng bên xác thực")
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .Result(userService.createUser(request))
                .message("User created successfully")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .Result(userService.getUserById(id))
                .message("User retrieved successfully")
                .success(true)
                .code(0)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String id, @RequestBody UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .Result(userService.updateUser(id, request))
                .message("User updated successfully")
                .success(true)
                .code(0)
                .build();
    }
    @PutMapping("/search/email/{email}/roles")
    public ApiResponse<UserResponse> updateRoleUser(@PathVariable String email) {
        return ApiResponse.<UserResponse>builder()
                .Result(userService.updateUserRoleManager(email))
                .message("User updated successfully")
                .success(true)
                .code(0)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ApiResponse.<String>builder()
                .Result("User deleted successfully")
                .message("User deleted successfully")
                .success(true)
                .code(0)
                .build();
    }
}
