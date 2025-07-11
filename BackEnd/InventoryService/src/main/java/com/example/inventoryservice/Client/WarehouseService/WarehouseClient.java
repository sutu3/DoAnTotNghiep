package com.example.inventoryservice.Client.WarehouseService;

import com.example.inventoryservice.Client.WarehouseService.Dto.Form.UpdateOccupancyRequest;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Stack.StackResponse;
import com.example.inventoryservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallbackClient;
import com.example.inventoryservice.Dtos.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "warehouse-service", url = "https://doantotnghiep-pb6y.onrender.com"
        ,fallback = WarehouseServiceFallbackClient.class)
public interface WarehouseClient {
    @GetMapping("/api/stacks/by-bin/{binId}")
    ApiResponse<StackResponse> getStackByBin(@PathVariable String binId);
    @GetMapping("/api/bins/{binId}/occupancy")
    ApiResponse<StackResponse> updateBinOccupancy(@PathVariable String binId, @RequestBody UpdateOccupancyRequest request);
}
