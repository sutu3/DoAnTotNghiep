package com.example.order.Client.UserService;


import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.Fallbacks.UserServiceFallback;
import com.example.order.Config.FeignConfiguration;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "User",
        url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        fallback = UserServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}

)
public interface UserController {
    @GetMapping(value = "/users/{id}", consumes = "application/json")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping(value = "/suppliers/{id}", consumes = "application/json")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);}
