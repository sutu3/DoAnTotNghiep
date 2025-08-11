package com.example.inventoryservice.Client.WarehouseService.Fallbacks;

import com.example.inventoryservice.Client.WarehouseService.Dto.Form.UpdateOccupancyRequest;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Stack.StackResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehouseCapacityResponse;
import com.example.inventoryservice.Client.WarehouseService.WarehouseClient;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

import java.util.List;

public class WarehouseServiceFallbackClient implements WarehouseClient {
    @Override
    public ApiResponse<StackResponse> getStackByBin(String binId) {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<StackResponse> updateBinOccupancy(String binId, UpdateOccupancyRequest request) {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<WarehouseCapacityResponse> getWarehouseCapacity(String warehouseId) {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<WarehouseCapacityResponse>> getAllList() {
        throw new AppException(ErrorCode.WAREHOUSE_SERVICE_NOT_WORKING);
    }
}
