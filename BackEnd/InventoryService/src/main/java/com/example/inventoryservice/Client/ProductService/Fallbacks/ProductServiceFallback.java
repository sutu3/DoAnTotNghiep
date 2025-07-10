package com.example.inventoryservice.Client.ProductService.Fallbacks;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;


public class ProductServiceFallback implements ProductController {
    @Override
    public ApiResponse<ProductResponse> getProductById(String id) {
        throw new AppException(ErrorCode.PRODUCT_SERVICE_NOT_WORKING);
    }

    @Override
    public ApiResponse<UnitNameResponse> getUnitById(String id) {
        throw new AppException(ErrorCode.PRODUCT_SERVICE_NOT_WORKING);
    }
}
