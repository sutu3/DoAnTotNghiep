package com.example.userservice.Client.WarehouseService.Fallbacks;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;

public class WarehouseServiceFallback implements WarehouseController {
    @Override
    public ApiResponse<WarehousesResponse> getWarehouse(String id) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
    @Override
    public ApiResponse<WarehousesResponse> getWarehousesByName(String name) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
}
