package com.example.productservice.Client.Inventory;

import com.example.productservice.Client.Inventory.Dto.Response.InventoryProductResponse;
import com.example.productservice.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.productservice.Client.Inventory.Dto.Response.StockMovementResponse;
import com.example.productservice.Client.Inventory.Dto.Response.UpdateStockLevelsRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.InventoryProductRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.InventoryWarehouseRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.productservice.Client.Inventory.Fallbacks.InventoryFallbacks;
import com.example.productservice.Config.FeignConfiguration;
import com.example.productservice.Dto.Requests.ProductClientRequest;
import com.example.productservice.Dto.Requests.ProductFilterRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Model.Product;
import com.example.productservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "Inventory",
        //url = "https://inventoryservice-0kl2.onrender.com/api",
        url = "http://localhost:8086/api",
        fallback = InventoryFallbacks.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface InventoryController {
    @PostMapping(value = "/inventory/warehouses", consumes = "application/json")
    ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(@RequestBody InventoryWarehouseRequest request);
    @PostMapping(value = "/inventory/movements", consumes = "application/json")
    ApiResponse<StockMovementResponse> createStockMovement(@RequestBody StockMovementRequest request);
    @PostMapping(value = "/inventory/products", consumes = "application/json")
    void createInventoryProduct(@RequestBody InventoryProductRequest request);
    @PostMapping(value = "/inventory/products/filter",consumes = "application/json")
    ApiResponse<List<ProductClientRequest>> filterProductsByWarehouse(@RequestBody ProductFilterRequest request);
    @PutMapping(value = "/inventory/products/batch/product/{productId}/stock-levels",consumes = "application/json")
    ApiResponse<Boolean> updateStockLevelsByProduct(@PathVariable String productId, @RequestBody UpdateStockLevelsRequest request);
}
