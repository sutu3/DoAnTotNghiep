package com.ddd.warehouse.Client.UserService.Fallbacks;


import com.ddd.warehouse.Client.UserService.Dto.Response.SupplierResponse;
import com.ddd.warehouse.Client.UserService.Dto.Response.UserResponse;
import com.ddd.warehouse.Client.UserService.Redis.UserController;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;

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
