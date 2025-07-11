package com.example.redisservice.Client.WarehouseService.Fallbacks;


import com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.Client.WarehouseService.WarehouseController;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Exception.AppException;
import com.example.redisservice.Exception.ErrorCode;

import java.util.List;


public class WarehouseServiceFallback implements WarehouseController {
    @Override
    public ApiResponse<WarehousesResponse> getWarehouse(String id) {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
    @Override
    public ApiResponse<WarehousesResponse> getWarehousesByName(String name) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<BinResponse> getBinById(String binId) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(String warehouseId) {
        throw new  AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
}
