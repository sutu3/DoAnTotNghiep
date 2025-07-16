package com.example.authenservice.Client.UserService.Fallbacks;


import com.example.authenservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.authenservice.Client.UserService.Redis.UserController;
import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Dtos.Response.UserResponse;
import com.example.authenservice.Exception.AppException;
import com.example.authenservice.Exception.ErrorCode;

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
