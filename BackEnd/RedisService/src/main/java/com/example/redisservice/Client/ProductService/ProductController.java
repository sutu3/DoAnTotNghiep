package com.example.redisservice.Client.ProductService;



import com.example.redisservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.redisservice.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.redisservice.Client.ProductService.Fallbacks.ProductServiceFallback;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Security.AuthenticationRequestInterceptor;
import com.example.redisservice.config.FeignConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Product",
        url = "https://productservice-8qdv.onrender.com/api",
        fallback = ProductServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface ProductController {
    @GetMapping("/products/search/productId/{productId}")
    ApiResponse<ProductResponse> getProductById(@PathVariable String productId);
    @GetMapping("/units/search/unitId/{unitId}")
    ApiResponse<UnitNameResponse> getUnitById(@PathVariable String unitId);



}

