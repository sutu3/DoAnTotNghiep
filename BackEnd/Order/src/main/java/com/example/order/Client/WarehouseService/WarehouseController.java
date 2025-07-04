package com.example.order.Client.WarehouseService;



import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.Fallbacks.WarehouseServiceFallback;
import com.example.order.Dto.Response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "Warehouse",
        url = "https://doantotnghiep-pb6y.onrender.com/api",
        fallback = WarehouseServiceFallback.class)
public interface WarehouseController {
    @GetMapping("/warehouses/{id}")
    ApiResponse<WarehousesResponse> getWarehouse(@PathVariable String id);
    @GetMapping("/warehouses/search/byName")
    ApiResponse<WarehousesResponse> getWarehousesByName(@RequestParam String name);
    @GetMapping("/bins/search/binId/{binId}")
    ApiResponse<BinResponse> getBinById(@PathVariable String binId);


}
