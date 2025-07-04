package com.example.order.Client.ProductService.Fallbacks;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;


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
