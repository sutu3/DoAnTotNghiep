package com.example.inventoryservice.Client.UserService.Fallbacks;


import com.example.inventoryservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

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
