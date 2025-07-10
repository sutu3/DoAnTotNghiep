package com.example.inventoryservice.Client.ProductService.Redis;



import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.inventoryservice.Client.ProductService.Fallbacks.ProductServiceFallback;
import com.example.inventoryservice.Dtos.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Product",
        url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        fallback = ProductServiceFallback.class)
public interface ProductController {
    @GetMapping("/products/{productId}")
    ApiResponse<ProductResponse> getProductById(@PathVariable String productId);
    @GetMapping("/units/{unitId}")
    ApiResponse<UnitNameResponse> getUnitById(@PathVariable String unitId);



}

