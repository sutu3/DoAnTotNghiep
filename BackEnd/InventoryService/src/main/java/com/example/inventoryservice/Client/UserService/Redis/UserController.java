package com.example.inventoryservice.Client.UserService.Redis;


import com.example.inventoryservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Fallbacks.UserServiceFallback;
import com.example.inventoryservice.Dtos.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "User",
        url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        fallback = UserServiceFallback.class)
public interface UserController {
    @GetMapping("/users/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping("/suppliers/{id}")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);}
