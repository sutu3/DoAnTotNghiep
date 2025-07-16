package com.example.order.Client.Inventory.Fallbacks;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Response.StockMovementResponse;
import com.example.order.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;

public class InventoryFallbacks implements InventoryController {

    @Override
    public ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(InventoryWarehouseRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<StockMovementResponse> createStockMovement(StockMovementRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }
}
