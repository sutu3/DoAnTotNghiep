package com.example.inventoryservice.Service;


import com.example.inventoryservice.Client.ProductService.Dto.Response.Product.ProductClientRequest;
import com.example.inventoryservice.Dtos.Request.InventoryProductRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductResponse;
import com.example.inventoryservice.Form.InventoryProductForm;
import com.example.inventoryservice.Module.InventoryProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InventoryProductService {
    Page<InventoryProductResponse> getAllByWarehouse(Pageable pageable, String warehouse);
    InventoryProduct getById(String id);
    List<ProductClientRequest> getFilterProductByWarehouse(String warehouse, List<ProductClientRequest> products);
    InventoryProductResponse getByIdResponse(String id);
    InventoryProduct getByProductAndWarehouse(String product, String warehouse);
    InventoryProductResponse getByProductAndWarehouseResponse(String product, String warehouse);
    InventoryProductResponse createInventoryProduct(InventoryProductRequest request);
    InventoryProductResponse updateInventoryProduct(InventoryProductForm form, String id);
    void deleteInventoryProduct(String id);
    List<InventoryProductResponse> getLowStockProducts();
    InventoryProductResponse enrich(InventoryProduct inventoryProduct);
}
