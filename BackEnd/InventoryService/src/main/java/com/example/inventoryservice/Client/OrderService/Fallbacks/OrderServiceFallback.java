package com.example.inventoryservice.Client.OrderService.Fallbacks;


import com.example.inventoryservice.Client.OrderService.OrderController;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;

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
}
