package com.example.order.Client.ProductService;


import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.Fallbacks.ProductServiceFallback;
import com.example.order.Config.FeignConfiguration;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Product",
        //url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        url = "http://localhost:8087/api/cache",
        fallback = ProductServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface ProductController {
    @GetMapping(value = "/products/{productId}", consumes = "application/json")
    ApiResponse<ProductResponse> getProductById(@PathVariable String productId);
    @GetMapping(value = "/units/{unitId}", consumes = "application/json")
    ApiResponse<UnitNameResponse> getUnitById( @PathVariable String unitId);



}

