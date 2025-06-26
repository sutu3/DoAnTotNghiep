package com.example.productservice.Client.WarehouseService.Fallbacks;


import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;

public class WarehouseServiceFallback implements WarehouseController {
    @Override
    public ApiResponse<WarehousesResponse> getWarehouse(String id) {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
    @Override
    public ApiResponse<WarehousesResponse> getWarehousesByName(String name) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
}
