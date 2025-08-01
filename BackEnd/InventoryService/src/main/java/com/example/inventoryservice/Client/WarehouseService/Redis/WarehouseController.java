package com.example.inventoryservice.Client.WarehouseService.Redis;



import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "Warehouse",
        //url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        url = "http://localhost:8087/api/cache",
        fallback = WarehouseServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class})
public interface WarehouseController {
    @GetMapping(value = "/warehouses/{id}", consumes = "application/json")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping(value = "/warehouses/byName", consumes = "application/json")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
    @GetMapping(value = "/bins/{binId}", consumes = "application/json")
    ApiResponse<BinResponse> getBinById(@PathVariable String binId);
    @GetMapping(value = "/bins/byWarehouse/{warehouseId}/list", consumes = "application/json")
    ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(@PathVariable String warehouseId);
}
