package com.example.redisservice.Client.ProductService.Fallbacks;


import com.example.redisservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.redisservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.redisservice.Client.ProductService.ProductController;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Exception.AppException;
import com.example.redisservice.Exception.ErrorCode;

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
