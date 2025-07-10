package com.example.inventoryservice.Client.WarehouseService.Fallbacks;


import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

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
