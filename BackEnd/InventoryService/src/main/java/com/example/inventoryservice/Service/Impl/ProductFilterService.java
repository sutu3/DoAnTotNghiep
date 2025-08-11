package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.OrderService.OrderController;
import com.example.inventoryservice.Client.ProductService.Dto.Response.Product.ProductClientRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductTotalStock;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Service.InventoryProductService;
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
    private final OrderController orderController; // Thêm OrderService client
    private final InventoryProductService inventoryProductService;

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

        // Lọc và gán quantity + approved pending quantities
        return products.stream()
                .filter(p -> productQuantityMap.containsKey(p.getProductId()))
                .map(p -> {
                    p.setQuantity(productQuantityMap.get(p.getProductId()));
                    InventoryProductTotalStock inventoryProductTotalStock=inventoryProductService.getInventoryProductTotalStock(p.getProductId());
                    p.setMaxStockLevel(inventoryProductTotalStock.getMaxStockLevel());
                    p.setMinStockLevel(inventoryProductTotalStock.getMinStockLevel());
                    // Gọi API để lấy approved pending quantities
                    try {
                        Integer approvedImport = orderController.getApprovedImportOrdersByProduct(
                                p.getProductId(), warehouseId).getResult();
                        Integer approvedExport = orderController.getApprovedExportOrdersByProduct(
                                p.getProductId(), warehouseId).getResult();

                        p.setPendingApprovedImportQuantity(approvedImport);
                        p.setPendingApprovedExportQuantity(approvedExport);
                    } catch (Exception e) {
                        log.warn("Failed to get approved orders for product {}: {}", p.getProductId(), e.getMessage());
                        p.setPendingApprovedImportQuantity(0);
                        p.setPendingApprovedExportQuantity(0);
                    }

                    return p;
                })
                .toList();
    }
}
