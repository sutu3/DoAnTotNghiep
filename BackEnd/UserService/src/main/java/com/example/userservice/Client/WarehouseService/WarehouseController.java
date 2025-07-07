package com.example.userservice.Client.WarehouseService;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.userservice.Dto.Responses.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "Warehouse",
        url = "https://doantotnghiep-r5ta.onrender.com/api",
        fallback = WarehouseServiceFallback.class)
public interface WarehouseController {
    @GetMapping("/warehouses/{id}")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping("/warehouses/search/byName")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
}
