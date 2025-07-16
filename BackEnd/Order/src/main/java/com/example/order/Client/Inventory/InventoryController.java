package com.example.order.Client.Inventory;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Response.StockMovementResponse;
import com.example.order.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.Fallbacks.InventoryFallbacks;
import com.example.order.Client.ProductService.Fallbacks.ProductServiceFallback;
import com.example.order.Dto.Response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "Inventory",
        url = "https://inventoryservice-0kl2.onrender.com/api",
        fallback = InventoryFallbacks.class)
public interface InventoryController {
    @PostMapping("/inventory/warehouses")
    ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(@RequestBody InventoryWarehouseRequest request);
    @PostMapping("/inventory/movements")
    ApiResponse<StockMovementResponse> createStockMovement(@RequestBody StockMovementRequest request);
}
