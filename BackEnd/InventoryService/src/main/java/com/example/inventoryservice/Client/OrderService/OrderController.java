package com.example.inventoryservice.Client.OrderService;

import com.example.inventoryservice.Client.OrderService.Fallbacks.OrderServiceFallback;
import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Security.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "order-service",
        url = "https://orderservice-3u1b.onrender.com",
        fallback = OrderServiceFallback.class,
        configuration = {AuthenticationRequestInterceptor.class, FeignConfiguration.class}
)
public interface OrderController {
    @GetMapping(value = "/api/importItems/recent-suppliers/product/{productId}/warehouse/{warehouseId}", consumes = "application/json")
    ApiResponse<List<String>> getRecentSuppliersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );

    @GetMapping(value = "/api/importOrders/pending-orders/product/{productId}/warehouse/{warehouseId}", consumes = "application/json")
    ApiResponse<Integer> getPendingOrdersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );

}
