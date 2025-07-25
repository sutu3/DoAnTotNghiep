package com.example.inventoryservice.Client.UserService.Fallbacks;


import com.example.inventoryservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.UserClient;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

import java.util.List;

public class UserClientServiceFallback implements UserClient {

    @Override
    public ApiResponse<List<UserResponse>> getActiveUsersByWarehouse(String warehouseId) {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }
}
