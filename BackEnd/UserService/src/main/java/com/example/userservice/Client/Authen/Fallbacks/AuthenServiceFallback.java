package com.example.userservice.Client.Authen.Fallbacks;

import com.example.userservice.Client.Authen.AuthenController;
import com.example.userservice.Client.Authen.Dto.Request.UserRequestAuthen;
import com.example.userservice.Client.Authen.Dto.Response.RoleResponse;
import com.example.userservice.Client.Authen.Dto.Response.UserResponseClient;
import com.example.userservice.Dto.Request.UpdateRole;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;

import java.util.Set;

public class AuthenServiceFallback implements AuthenController {

    @Override
    public ApiResponse<UserResponseClient> createUser(UserRequestAuthen request) {
        throw new  AppException(ErrorCode.UNAUTHENTICATED);
    }

    @Override
    public ApiResponse<Set<RoleResponse>> getRoleByUserId(String userid) {
        throw new  AppException(ErrorCode.UNAUTHENTICATED);
    }

    @Override
    public ApiResponse<UserResponseClient> updateRoleUser(String email, UpdateRole updateRole) {
        throw new  AppException(ErrorCode.UNAUTHENTICATED);
    }
}
