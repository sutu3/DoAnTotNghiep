package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.Product.ProductClientRequest;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductFilterService {

    private final InventoryProductRepo inventoryProductRepo;

    public List<ProductClientRequest> filterByWarehouse(String warehouseId, List<ProductClientRequest> products) {
        log.info("🔎 Filtering products by warehouseId = {}", warehouseId);

        List<InventoryProduct> inventoryProducts = inventoryProductRepo.findAllByWarehouse(warehouseId);

        if (inventoryProducts == null || inventoryProducts.isEmpty()) {
            log.warn("⚠️ No products found in warehouse {}", warehouseId);
            return List.of();
        }

        // Chuyển InventoryProduct thành Map<productId, totalQuantity> để tra nhanh
        Map<String, BigDecimal> productQuantityMap = inventoryProducts.stream()
                .collect(Collectors.toMap(InventoryProduct::getProduct, InventoryProduct::getTotalQuantity));

        // Lọc và gán quantity
        return products.stream()
                .filter(p -> productQuantityMap.containsKey(p.getProductId()))
                .map(p -> {
                    p.setQuantity(productQuantityMap.get(p.getProductId()));
                    return p;
                })
                .toList();
    }

}
