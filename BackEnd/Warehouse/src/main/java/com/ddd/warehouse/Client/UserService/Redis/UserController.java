package com.ddd.warehouse.Client.UserService.Redis;


import com.ddd.warehouse.Client.UserService.Dto.Response.SupplierResponse;
import com.ddd.warehouse.Client.UserService.Dto.Response.UserResponse;
import com.ddd.warehouse.Client.UserService.Fallbacks.UserServiceFallback;
import com.ddd.warehouse.Config.FeignConfiguration;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Catch",
        //url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        url = "http://localhost:8087/api/cache",
        fallback = UserServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface UserController {
    @GetMapping(value = "/users/{id}",consumes = "application/json")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping("/suppliers/{id}")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);}
