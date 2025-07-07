package com.example.redisservice.Client.UserService.Fallbacks;


import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.UserService.UserController;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Exception.AppException;
import com.example.redisservice.Exception.ErrorCode;

public class UserServiceFallback implements UserController {
    @Override
    public ApiResponse<UserResponse> getUser(String id) {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<SupplierResponse> getSupplier(String id) {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }
}
