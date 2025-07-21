package com.ddd.warehouse.Client.UserService;

import com.ddd.warehouse.Client.UserService.Dto.Response.IdWarehouseResponse;
import com.ddd.warehouse.Client.UserService.Fallbacks.UserClientFallback;
import com.ddd.warehouse.Config.FeignConfiguration;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "user-service", // tên bất kỳ, thường dùng để service discovery
        url = "http://localhost:8081/api",
        fallback = UserClientFallback.class,
        configuration = {FeignConfiguration.class, AuthenticationRequestInterceptor.class}
)
public interface UserClient {
    @GetMapping("/users/search/GetIdWarehouseByIdUser")
    ApiResponse<IdWarehouseResponse> getIdWarehouseByIdUser();
}
