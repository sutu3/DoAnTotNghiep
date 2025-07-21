package com.ddd.warehouse.Client.UserService.Fallbacks;


import com.ddd.warehouse.Client.UserService.Dto.Response.IdWarehouseResponse;
import com.ddd.warehouse.Client.UserService.Dto.Response.SupplierResponse;
import com.ddd.warehouse.Client.UserService.Dto.Response.UserResponse;
import com.ddd.warehouse.Client.UserService.Redis.UserController;
import com.ddd.warehouse.Client.UserService.UserClient;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;

public class UserClientFallback implements UserClient {

    @Override
    public ApiResponse<IdWarehouseResponse> getIdWarehouseByIdUser() {
        throw new AppException(ErrorCode.USER_SERVICE_NOT_WORKING);
    }
}
