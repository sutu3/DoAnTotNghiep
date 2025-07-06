package com.example.order.Client.WarehouseService.Fallbacks;


import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;

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
}
