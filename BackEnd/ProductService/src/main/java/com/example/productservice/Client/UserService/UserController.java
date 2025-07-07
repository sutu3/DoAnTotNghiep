package com.example.productservice.Client.UserService;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.Fallbacks.UserServiceFallback;
import com.example.productservice.Dto.Responses.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Catch",
        url = "https://doantotnghiep-r5ta.onrender.com",
        fallback = UserServiceFallback.class)
public interface UserController {
    @GetMapping("/user/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping("/supplier/{id}")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);}
