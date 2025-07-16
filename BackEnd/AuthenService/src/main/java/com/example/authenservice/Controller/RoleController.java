package com.example.authenservice.Controller;

import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Dtos.Request.RoleRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/authen/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Role Authen API", description = "Quản lý quyền bên xác thực")
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .Result(roleService.PostRole(request))
                .message("Role created successfully")
                .success(true)
                .code(0)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .Result(roleService.getall())
                .message("Roles retrieved successfully")
                .success(true)
                .code(0)
                .build();
    }


}
