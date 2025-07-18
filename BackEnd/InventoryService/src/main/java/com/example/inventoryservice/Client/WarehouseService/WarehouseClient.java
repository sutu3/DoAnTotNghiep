package com.example.inventoryservice.Client.WarehouseService;

import com.example.inventoryservice.Client.WarehouseService.Dto.Form.UpdateOccupancyRequest;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Stack.StackResponse;
import com.example.inventoryservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallbackClient;
import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "warehouse-service", url = "https://doantotnghiep-pb6y.onrender.com"
        ,fallback = WarehouseServiceFallbackClient.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface WarehouseClient {
    @GetMapping(value = "/api/stacks/by-bin/{binId}", consumes = "application/json")
    ApiResponse<StackResponse> getStackByBin(@PathVariable String binId);
    @PutMapping(value = "/api/bins/{binId}/occupancy", consumes = "application/json")
    ApiResponse<StackResponse> updateBinOccupancy(@PathVariable String binId, @RequestBody UpdateOccupancyRequest request);
}
