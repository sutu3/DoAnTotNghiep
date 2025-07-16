package com.example.authenservice.Client.UserService.Fallbacks;

import com.example.authenservice.Client.UserService.Dto.Response.UserResponse;
import com.example.authenservice.Client.UserService.UserClient;
import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Exception.AppException;
import com.example.authenservice.Exception.ErrorCode;

public class UserClentServiceFallback implements UserClient {

    @Override
    public ApiResponse<UserResponse> getByEmail(String email) {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }
}
