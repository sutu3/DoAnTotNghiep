package com.example.userservice.Client.Authen;

import com.example.userservice.Client.Authen.Dto.Request.UserRequestAuthen;
import com.example.userservice.Client.Authen.Dto.Response.RoleResponse;
import com.example.userservice.Client.Authen.Dto.Response.UserResponseClient;
import com.example.userservice.Client.Authen.Fallbacks.AuthenServiceFallback;
import com.example.userservice.Config.FeignConfiguration;
import com.example.userservice.Dto.Request.UpdateRole;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@FeignClient(
        name = "AuthenService",
        //url = "https://doantotnghiep-3a2x.onrender.com/api",
        url = "http://localhost:8088/api",
        fallback = AuthenServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface AuthenController {
    @PostMapping(value = "/authen/users", consumes = "application/json")
    ApiResponse<UserResponseClient> createUser(@RequestBody UserRequestAuthen request);
    @GetMapping(value = "/authen/users/search/user/{userid}", consumes = "application/json")
    ApiResponse<Set<RoleResponse>> getRoleByUserId(@PathVariable String userid);
    @PutMapping(value = "/authen/users/search/email/{email}/roles", consumes = "application/json")
    ApiResponse<UserResponseClient> updateRoleUser(@PathVariable String email,@RequestBody UpdateRole updateRole);
}
