package com.example.authenservice.Client.UserService;

import com.example.authenservice.Client.UserService.Dto.Response.UserResponse;
import com.example.authenservice.Client.UserService.Fallbacks.UserClentServiceFallback;
import com.example.authenservice.Dtos.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "UserService",
        //url = "https://userservice-kuug.onrender.com/api"
        url = "http://localhost:8081/api"
        ,fallback = UserClentServiceFallback.class)
public interface UserClient {
    @GetMapping("/users/search/email/{email}")
    ApiResponse<UserResponse> getByEmail(@PathVariable String email);
}
