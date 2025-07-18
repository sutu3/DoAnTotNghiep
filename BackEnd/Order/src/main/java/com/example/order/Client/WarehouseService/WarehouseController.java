package com.example.order.Client.WarehouseService;



import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.order.Config.FeignConfiguration;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "Warehouse",
        url = "https://doantotnghiep-r5ta.onrender.com/api/cache",
        fallback = WarehouseServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface WarehouseController {
    @GetMapping(value = "/warehouses/{id}", consumes = "application/json")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping(value = "/warehouses/byName", consumes = "application/json")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
    @GetMapping(value = "/bins/{binId}", consumes = "application/json")
    ApiResponse<BinResponse> getBinById(@PathVariable String binId);

}
