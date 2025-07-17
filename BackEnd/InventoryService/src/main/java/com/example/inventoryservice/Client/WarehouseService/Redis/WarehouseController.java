package com.example.inventoryservice.Client.WarehouseService.Redis;



import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "Warehouse",
        url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        fallback = WarehouseServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class})
public interface WarehouseController {
    @GetMapping("/warehouses/{id}")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping("/warehouses/byName")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
    @GetMapping("/bins/{binId}")
    ApiResponse<BinResponse> getBinById(@PathVariable String binId);
    @GetMapping("/bins/byWarehouse/{warehouseId}/list")
    ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(@PathVariable String warehouseId);
}
