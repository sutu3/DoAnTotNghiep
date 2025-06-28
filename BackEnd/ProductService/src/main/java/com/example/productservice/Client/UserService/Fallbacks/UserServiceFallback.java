package com.example.productservice.Client.UserService.Fallbacks;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;

public class UserServiceFallback implements UserController {
    @Override
    public ApiResponse<UserResponse> getUser(String id) {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }
}
