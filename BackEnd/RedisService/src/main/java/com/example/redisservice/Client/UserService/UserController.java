package com.example.redisservice.Client.UserService;



import com.example.redisservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.redisservice.Client.UserService.Dto.Response.UserResponse;
import com.example.redisservice.Client.UserService.Fallbacks.UserServiceFallback;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Security.AuthenticationRequestInterceptor;
import com.example.redisservice.config.FeignConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "User",
        //url = "https://userservice-kuug.onrender.com/api",
        url = "http://localhost:8081/api",
        fallback = UserServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface UserController {
    @GetMapping(value = "/users/{id}",consumes="application/json")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping(value = "/suppliers/{id}",consumes = "application/json")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);}
