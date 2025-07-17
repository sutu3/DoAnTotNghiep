package com.example.redisservice.Client.WarehouseService;




import com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.redisservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.redisservice.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.redisservice.DTOs.Response.ApiResponse;
import com.example.redisservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "Warehouse",
        url = "https://doantotnghiep-pb6y.onrender.com/api",
        fallback = WarehouseServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface WarehouseController {
    @GetMapping("/warehouses/{id}")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping("/warehouses/search/byName")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
    @GetMapping("/bins/search/binId/{binId}")
    ApiResponse<BinResponse> getBinById(@PathVariable String binId);
    @GetMapping("/bins/byWarehouse/{warehouseId}/list")
    ApiResponse<List<BinResponse>> getAllListBinByWarehouseId(@PathVariable String warehouseId);

}
