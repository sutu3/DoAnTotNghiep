package com.example.userservice.Client.Authen;

import com.example.userservice.Client.Authen.Dto.Request.UserRequestAuthen;
import com.example.userservice.Client.Authen.Dto.Response.UserResponse;
import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.userservice.Config.FeignConfiguration;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "AuthenService",
        url = "https://doantotnghiep-3a2x.onrender.com/api",
        //url = "http://localhost:8081/api/cache",
        fallback = WarehouseServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface AuthenController {
    @PostMapping(value = "/authen/users", consumes = "application/json")
    ApiResponse<UserResponse> createUser(@RequestBody UserRequestAuthen request);
}
