package com.example.authenservice.Client.UserService.Redis;



import com.example.authenservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.authenservice.Client.UserService.Fallbacks.UserServiceFallback;
import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Dtos.Response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "User",
        //url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        url = "http://localhost:8087/api/cache",
        fallback = UserServiceFallback.class)
public interface UserController {
    @GetMapping("/users/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id);
    @GetMapping("/suppliers/{id}")
    ApiResponse<SupplierResponse> getSupplier(@PathVariable String id);

}

