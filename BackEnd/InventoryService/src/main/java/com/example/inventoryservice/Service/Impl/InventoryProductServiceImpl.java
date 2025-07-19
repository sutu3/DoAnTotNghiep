package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Dtos.Request.InventoryProductRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductResponse;
import com.example.inventoryservice.Enum.InventoryStatus;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryProductForm;
import com.example.inventoryservice.Mapper.InventoryProductMapper;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Service.InventoryProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryProductServiceImpl implements InventoryProductService {

    InventoryProductRepo inventoryProductRepo;
    InventoryProductMapper inventoryProductMapper;
    ProductController productController;
    WarehouseController warehouseController;
    AsyncServiceImpl asyncServiceImpl;

    @Override
    public Page<InventoryProductResponse> getAllByWarehouse(Pageable pageable, String warehouse) {
        return inventoryProductRepo.findAllByWarehouseAndIsDeleted(warehouse, false, pageable)
                .map(this::enrich);
    }

    @Override
    public InventoryProduct getById(String id) {
        return inventoryProductRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_PRODUCT_NOT_FOUND));
    }

    @Override
    public InventoryProductResponse getByIdResponse(String id) {
        return enrich(getById(id));
    }

    @Override
    public InventoryProduct getByProductAndWarehouse(String product, String warehouse) {
        InventoryProduct inventoryProduct = inventoryProductRepo
                .findByProductAndWarehouseAndIsDeleted(product, warehouse, false)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_PRODUCT_NOT_FOUND));
        return inventoryProduct;
    }

    @Override
    public InventoryProductResponse getByProductAndWarehouseResponse(String product, String warehouse) {
        InventoryProduct inventoryProduct=getByProductAndWarehouse(product, warehouse);
        return enrich(inventoryProduct);
    }

    @Override
    public InventoryProductResponse createInventoryProduct(InventoryProductRequest request) {
        // Validate product and warehouse exist
        productController.getProductById(request.product());
        warehouseController.getWarehouse(request.warehouse());

        // Check if already exists
        Optional<InventoryProduct> existing = inventoryProductRepo
                .findByProductAndWarehouseAndIsDeleted(request.product(), request.warehouse(), false);

        if (existing.isPresent()) {
            throw new AppException(ErrorCode.INVENTORY_PRODUCT_EXISTS);
        }

        InventoryProduct inventoryProduct = inventoryProductMapper.toEntity(request);
        inventoryProduct.setStatus(InventoryStatus.valueOf(request.status().toUpperCase()));
        inventoryProduct.setIsDeleted(false);
        InventoryProduct savedProduct = inventoryProductRepo.save(inventoryProduct);

        return enrich(savedProduct);
    }

    @Override
    public InventoryProductResponse updateInventoryProduct(InventoryProductForm form, String id) {
        InventoryProduct inventoryProduct = getById(id);
        inventoryProductMapper.update(inventoryProduct, form);
        inventoryProduct.setUpdatedAt(LocalDateTime.now());

        InventoryProduct updatedProduct = inventoryProductRepo.save(inventoryProduct);
        return enrich(updatedProduct);
    }

    @Override
    public void deleteInventoryProduct(String id) {
        InventoryProduct inventoryProduct = getById(id);
        inventoryProduct.setIsDeleted(true);
        inventoryProduct.setDeletedAt(LocalDateTime.now());
        inventoryProductRepo.save(inventoryProduct);
    }

    @Override
    public List<InventoryProductResponse> getLowStockProducts() {
        return inventoryProductRepo.findLowStockProducts()
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryProductResponse enrich(InventoryProduct inventoryProduct) {
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(inventoryProduct.getProduct());
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(inventoryProduct.getWarehouse());

        CompletableFuture.allOf(productFuture, warehouseFuture).join();

        InventoryProductResponse response = inventoryProductMapper.toResponse(inventoryProduct);
        response.setProductDetails(productFuture.join());
        response.setWarehouseDetails(warehouseFuture.join());

        return response;
    }
}
