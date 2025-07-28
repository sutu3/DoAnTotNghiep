package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.Product.ProductClientRequest;
import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Dtos.Request.InventoryProductRequest;
import com.example.inventoryservice.Dtos.Request.UpdateStockLevelsRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductResponse;
import com.example.inventoryservice.Dtos.Response.InventoryProductTotalStock;
import com.example.inventoryservice.Dtos.Response.InventoryWarehouseResponse;
import com.example.inventoryservice.Enum.InventoryStatus;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryProductForm;
import com.example.inventoryservice.Mapper.InventoryProductMapper;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Service.InventoryProductService;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
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
    public List<ProductClientRequest> getFilterProductByWarehouse(String warehouse, List<ProductClientRequest> products) {
        List<String> idProductByWarehouse = inventoryProductRepo.findAllListIdProduct(warehouse);

        if (idProductByWarehouse != null && !idProductByWarehouse.isEmpty()) {
            return products.stream()
                    .filter(productClient -> idProductByWarehouse.contains(productClient.getProductId()))
                    .toList();
        }
        return null;
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

        // Check if already exists (active)
        Optional<InventoryProduct> existing = inventoryProductRepo
                .findByProductAndWarehouseAndIsDeleted(request.product(), request.warehouse(), false);

        if (existing.isPresent()) {
            throw new AppException(ErrorCode.INVENTORY_PRODUCT_EXISTS);
        }

        // Check if exists but deleted (for restoration)
        Optional<InventoryProduct> deletedExisting = inventoryProductRepo
                .findByProductAndWarehouseAndIsDeleted(request.product(), request.warehouse(), true);

        if (deletedExisting.isPresent()) {
            // Restore the deleted record instead of creating new one
            InventoryProduct inventoryProduct = deletedExisting.get();

            // Update with new request data
            inventoryProductMapper.update(inventoryProduct,
                    new InventoryProductForm(
                            request.totalQuantity(),
                            request.minStockLevel(),
                            request.maxStockLevel(),
                            request.status()
                    ));

            inventoryProduct.setStatus(InventoryStatus.valueOf(request.status().toUpperCase()));
            inventoryProduct.setIsDeleted(false);
            inventoryProduct.setDeletedAt(null);
            inventoryProduct.setUpdatedAt(LocalDateTime.now());

            InventoryProduct savedProduct = inventoryProductRepo.save(inventoryProduct);
            return enrich(savedProduct);
        }

        // Create new if no existing record found
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
    public List<InventoryProductResponse> getAllByProduct(String idProduct) {
        return inventoryProductRepo.findAllByProductAndIsDeleted(idProduct,false)
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

    @Override
    public InventoryProductTotalStock getInventoryProductTotalStock(String idProduct) {
        InventoryProduct inventoryProduct=inventoryProductRepo
                .findFirstByProductAndIsDeleted(idProduct,false)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_PRODUCT_NOT_FOUND));
        InventoryProductTotalStock inventoryProductTotalStock=InventoryProductTotalStock.builder()
                .minStockLevel(inventoryProduct.getMinStockLevel())
                .maxStockLevel(inventoryProduct.getMaxStockLevel())
                .build();
        return inventoryProductTotalStock;
    }

    @Override
    @Transactional
    public List<InventoryProductResponse> batchUpdateInventoryProduct(String productId, List<InventoryProductRequest> requests) {
        // 1. Lấy tất cả InventoryProduct hiện có của product
        List<InventoryProduct> existingInventoryProducts = inventoryProductRepo
                .findAllByProductAndIsDeleted(productId, false);

        // 2. Tạo map để so sánh nhanh
        Map<String, InventoryProduct> existingMap = existingInventoryProducts.stream()
                .collect(Collectors.toMap(
                        ip -> ip.getProduct() + "_" + ip.getWarehouse(),
                        ip -> ip
                ));

        // 3. Tạo set các warehouse từ request để tracking
        Set<String> requestWarehouseKeys = requests.stream()
                .map(req -> req.product() + "_" + req.warehouse())
                .collect(Collectors.toSet());

        List<InventoryProductResponse> results = new ArrayList<>();

        // 4. Xử lý từng request
        for (InventoryProductRequest request : requests) {
            String key = request.product() + "_" + request.warehouse();

            if (existingMap.containsKey(key)) {
                // Đã tồn tại - bỏ qua và loại khỏi danh sách existing
                log.info("InventoryProduct already exists for product: {} warehouse: {}",
                        request.product(), request.warehouse());
                existingMap.remove(key);
            } else {
                // Chưa tồn tại - tạo mới
                try {
                    InventoryProductResponse created = createInventoryProduct(request);
                    results.add(created);
                    log.info("Created new InventoryProduct for product: {} warehouse: {}",
                            request.product(), request.warehouse());
                } catch (Exception e) {
                    log.error("Failed to create InventoryProduct for product: {} warehouse: {}",
                            request.product(), request.warehouse(), e);
                }
            }
        }

        // 5. Xóa mềm các InventoryProduct còn lại (không có trong request)
        for (InventoryProduct remaining : existingMap.values()) {
            deleteInventoryProduct(remaining.getInventoryProductId());
            log.info("Soft deleted InventoryProduct: {} for product: {} warehouse: {}",
                    remaining.getInventoryProductId(), remaining.getProduct(), remaining.getWarehouse());
        }

        return results;
    }

    @Override
    @Transactional
    public boolean updateStockLevelsByProduct(String productId, UpdateStockLevelsRequest request) {
        // Lấy tất cả InventoryProduct của product
        List<InventoryProduct> inventoryProducts = inventoryProductRepo
                .findAllByProduct(productId);

        List<InventoryProductResponse> results = new ArrayList<>();

        for (InventoryProduct inventoryProduct : inventoryProducts) {
            // Update stock levels
            inventoryProduct.setMinStockLevel(request.getMinStockLevel());
            inventoryProduct.setMaxStockLevel(request.getMaxStockLevel());
            inventoryProduct.setUpdatedAt(LocalDateTime.now());

            inventoryProductRepo.save(inventoryProduct);
        }

        return true;
    }

}
