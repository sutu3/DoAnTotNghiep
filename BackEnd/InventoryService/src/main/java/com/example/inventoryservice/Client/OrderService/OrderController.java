package com.example.inventoryservice.Client.OrderService;

import com.example.inventoryservice.Client.OrderService.Fallbacks.OrderServiceFallback;
import com.example.inventoryservice.Dtos.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "order-service", url = "https://orderservice-3u1b.onrender.com",fallback = OrderServiceFallback.class)
public interface OrderController {
    @GetMapping("/api/importItems/recent-suppliers/product/{productId}/warehouse/{warehouseId}")
    ApiResponse<List<String>> getRecentSuppliersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );

    @GetMapping("/api/importOrders/pending-orders/product/{productId}/warehouse/{warehouseId}")
    ApiResponse<Integer> getPendingOrdersByProduct(
            @PathVariable String productId,
            @PathVariable String warehouseId
    );

}
