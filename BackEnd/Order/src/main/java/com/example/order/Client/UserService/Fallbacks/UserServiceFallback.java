package com.example.order.Client.UserService.Fallbacks;


import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;

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
