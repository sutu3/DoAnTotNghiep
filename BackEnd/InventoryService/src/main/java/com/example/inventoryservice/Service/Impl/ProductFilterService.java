package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.Product.ProductClientRequest;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductFilterService {

    private final InventoryProductRepo inventoryProductRepo;

    public List<ProductClientRequest> filterByWarehouse(String warehouseId, List<ProductClientRequest> products) {
        log.info("🔎 Filtering products by warehouseId = {}", warehouseId);

        List<String> idProductByWarehouse = inventoryProductRepo.findAllListIdProduct(warehouseId);

        if (idProductByWarehouse == null || idProductByWarehouse.isEmpty()) {
            log.warn("⚠️ No products found in warehouse {}", warehouseId);
            return List.of();
        }

        return products.stream()
                .filter(p -> idProductByWarehouse.contains(p.getProductId()))
                .toList();
    }
}
