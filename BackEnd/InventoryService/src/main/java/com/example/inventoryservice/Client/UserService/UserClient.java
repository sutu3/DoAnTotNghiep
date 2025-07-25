package com.example.inventoryservice.Client.UserService;

import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Fallbacks.UserClientServiceFallback;
import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
@FeignClient(
        name = "UserClient",
        //url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        url = "http://localhost:8081/api",
        fallback = UserClientServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class})
public interface UserClient {
    @GetMapping(value = "/users/search/warehouses/{warehouseId}/active", consumes = "application/json")
    ApiResponse<List<UserResponse>> getActiveUsersByWarehouse(@PathVariable String warehouseId);
}
