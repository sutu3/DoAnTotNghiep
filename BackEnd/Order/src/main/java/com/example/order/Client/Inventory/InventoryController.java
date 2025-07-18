package com.example.order.Client.Inventory;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Response.StockMovementResponse;
import com.example.order.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.Fallbacks.InventoryFallbacks;
import com.example.order.Client.ProductService.Fallbacks.ProductServiceFallback;
import com.example.order.Config.FeignConfiguration;
import com.example.order.Dto.Response.ApiResponse;
import com.example.order.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "Inventory",
        url = "https://inventoryservice-0kl2.onrender.com/api",
        //url = "http://localhost:8081/api",
        fallback = InventoryFallbacks.class,
        configuration = {
                AuthenticationRequestInterceptor.class,
                FeignConfiguration.class})
public interface InventoryController {
    @PostMapping(value = "/inventory/warehouses", consumes = "application/json")
    ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(@RequestBody InventoryWarehouseRequest request);
    @GetMapping(value = "/inventory/warehouses/search/bin/{binId}/singer", consumes = "application/json")
    ApiResponse<InventoryWarehouseResponse> getInventoryWarehouse(@PathVariable String binId);

    @PostMapping(value = "/inventory/movements", consumes = "application/json")
    ApiResponse<StockMovementResponse> createStockMovement(@RequestBody StockMovementRequest request);

}
