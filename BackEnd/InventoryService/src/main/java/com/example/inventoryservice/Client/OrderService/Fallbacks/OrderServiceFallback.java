package com.example.inventoryservice.Client.OrderService.Fallbacks;


import com.example.inventoryservice.Client.OrderService.Dtos.Response.ExportOrderResponse;
import com.example.inventoryservice.Client.OrderService.Dtos.Response.ImportOrderResponse;
import com.example.inventoryservice.Client.OrderService.OrderController;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

import java.time.LocalDateTime;
import java.util.List;

public class OrderServiceFallback implements OrderController {

    @Override
    public ApiResponse<List<String>> getRecentSuppliersByProduct(String productId, String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<Integer> getPendingOrdersByProduct(String productId, String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ImportOrderResponse>> getOrdersByWarehouseAndDateRange(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ExportOrderResponse>> getExportOrdersByWarehouseAndDateRange(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ImportOrderResponse>> getPendingImportOrdersByWarehouse(String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ExportOrderResponse>> getPendingExportOrdersByWarehouse(String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ImportOrderResponse>> getCompletedImportOrdersByWarehouse(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ExportOrderResponse>> getCompletedExportOrdersByWarehouse(String warehouseId, LocalDateTime fromDate, LocalDateTime toDate) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<Integer> getApprovedImportOrdersByProduct(String productId, String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<Integer> getApprovedExportOrdersByProduct(String productId, String warehouseId) {
        throw new AppException(ErrorCode.ORDER_SERVICE_NOT_WORKING);
    }
}
