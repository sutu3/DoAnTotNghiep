package com.example.productservice.Client.Inventory.Fallbacks;


import com.example.productservice.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.productservice.Client.Inventory.Dto.Response.StockMovementResponse;
import com.example.productservice.Client.Inventory.Dto.Response.UpdateStockLevelsRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.InventoryProductRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.productservice.Client.Inventory.InventoryController;
import com.example.productservice.Dto.Requests.ProductClientRequest;
import com.example.productservice.Dto.Requests.ProductFilterRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;
import com.example.productservice.Model.Product;

import java.util.List;

public class InventoryFallbacks implements InventoryController {

    @Override
    public ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(InventoryWarehouseRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<StockMovementResponse> createStockMovement(StockMovementRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }

    @Override
    public void createInventoryProduct(InventoryProductRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<List<ProductClientRequest>> filterProductsByWarehouse(ProductFilterRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<Boolean> updateStockLevelsByProduct(String productId, UpdateStockLevelsRequest request) {
        throw new AppException(ErrorCode.INVENTORY_SERVICE_NOT_WORKING);
    }


}
