package com.example.productservice.Service.Impl;

import com.example.productservice.Client.Inventory.Dto.Response.UpdateStockLevelsRequest;
import com.example.productservice.Client.Inventory.Dto.Resquest.InventoryProductRequest;
import com.example.productservice.Client.Inventory.InventoryController;
import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Dto.Requests.ProductClientRequest;
import com.example.productservice.Dto.Requests.ProductCreateWrapper;
import com.example.productservice.Dto.Requests.ProductFilterRequest;
import com.example.productservice.Dto.Requests.ProductRequest;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;
import com.example.productservice.Form.ProductForm;
import com.example.productservice.Mapper.ProductMapper;
import com.example.productservice.Model.Category;
import com.example.productservice.Model.Product;
import com.example.productservice.Model.Unit;
import com.example.productservice.Repo.ProductRepo;
import com.example.productservice.Repo.Specification.ProductSpecification;
import com.example.productservice.Service.CategoryService;
import com.example.productservice.Service.ProductService;
import com.example.productservice.Service.UnitService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ProductServiceImpl implements ProductService {
     ProductRepo productRepo;
     WarehouseController warehouseController;
     ProductMapper productMapper;
     CategoryService categoryService;
     UnitService unitService;
    private final AsyncServiceImpl asyncServiceImpl;
    private final InventoryController inventoryController;
    private final GetCurrentUserId getCurrentUserId;

    @Override
    public Page<ProductResponse> getAll( Pageable pageable) {
        return productRepo.findAllByIsDeleted( false, pageable)
                .map(this::enrich);
    }


    @Override
    public Page<ProductResponse> getAllBySupplier(String supplier, Pageable pageable) {
        return productRepo.findAllBySupplierAndIsDeleted(supplier, false, pageable)
                .map(this::enrich);
    }

    @Override
    public List<ProductResponse> searchProducts(String productName, String sku, String supplier, Boolean isActive) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasProductName(productName))
                .and(ProductSpecification.hasSku(sku))
                .and(ProductSpecification.hasSupplier(supplier))
                .and(ProductSpecification.isActive(isActive));
    List<Product> listProduct=productRepo.findAll(spec);
        return listProduct.stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }


    @Override
    public Product getById(String id) {
        return productRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public ProductResponse getByIdResponse(String id) {
        Product product = getById(id);
        Product productSave=productRepo.save(product);
        return  enrich(productSave);
    }

    @Override
    public ProductResponse createProduct(ProductCreateWrapper productCreateWrapper) {
        ProductRequest request=productCreateWrapper.getProductRequest();
        List<String> warehouseIds=productCreateWrapper.getIdWarehouses();
        Category category=categoryService.getById(request.category());
        Unit unit=unitService.getById(request.unit());
        if(warehouseIds == null || warehouseIds.isEmpty()) {
            throw new AppException(ErrorCode.WAREHOUSE_LIST_EMPTY);
        }

        for(String warehouseId : warehouseIds) {
            warehouseController.getWarehouse(warehouseId);
        }
        Optional<Product> existing=productRepo.findBySku(request.sku());
        var idUser=GetCurrentUserId.getCurrentUserId();
        if(existing.isPresent()){
            Product  product=existing.get();
            if(!product.getIsDeleted()){
                throw new AppException(ErrorCode.PRODUCT_EXISTS);
            }
            productMapper.updateResquest(product,request);
            product.setCategory(category);
            product.setUnit(unit);
            product.setIsDeleted(false);
            product.setCreateByUser(idUser);
            Product productSave=productRepo.save(product);
            for(String warehouseId:warehouseIds){
                InventoryProductRequest inventoryProductRequest=new InventoryProductRequest(productSave.getProductId(),
                        warehouseId,
                        BigDecimal.ZERO,
                        request.minStockLevel(),
                        request.maxStockLevel(),
                        "Active");
                inventoryController.createInventoryProduct(inventoryProductRequest);
            }

            return  enrich(productSave);
        }
        Product product=productMapper.toEntity(request);
        product.setCategory(category);
        product.setUnit(unit);
        product.setIsDeleted(false);
        product.setIsActive(true);
        product.setCreateByUser(idUser);
        Product productSave=productRepo.save(product);
        for(String warehouseId:warehouseIds){
            InventoryProductRequest inventoryProductRequest=new InventoryProductRequest(productSave.getProductId(),
                    warehouseId,
                    BigDecimal.ZERO,
                    request.minStockLevel(),
                    request.maxStockLevel(),
                    "Active");
            inventoryController.createInventoryProduct(inventoryProductRequest);
        }
        return  enrich(productSave);
    }

    @Override
    public List<ProductResponse> getProductsBySupplierFilteredByWarehouse(String supplierId, String warehouseId) {
        log.info("📦 Start filtering products by supplier={} and warehouse={}", supplierId, warehouseId);

        // 1. Lọc theo supplierId và active
        Specification<Product> spec = Specification.where(ProductSpecification.hasSupplier(supplierId))
                .and(ProductSpecification.isActive(true))
                .and(ProductSpecification.isDelete(false));

        List<Product> listProduct = productRepo.findAll(spec);
        if (listProduct.isEmpty()) {
            log.warn("⚠️ No products found for supplierId={}", supplierId);
            return List.of();
        }

        // 2. Tạo request để gọi sang inventory service
        ProductFilterRequest request = new ProductFilterRequest(
                warehouseId,
                listProduct.stream().map(productMapper::toClientRequest).toList()
        );

        List<ProductClientRequest> filteredProductDtos = inventoryController
                .filterProductsByWarehouse(request)
                .getResult();

        if (filteredProductDtos == null || filteredProductDtos.isEmpty()) {
            log.warn("⚠️ No products matched in warehouseId={}", warehouseId);
            return List.of();
        }

        // 3. Tạo Map từ kết quả inventory (bao gồm approved quantities)
        Map<String, ProductClientRequest> productDataMap = filteredProductDtos.stream()
                .collect(Collectors.toMap(ProductClientRequest::getProductId, p -> p));

        // 4. Trả về danh sách enriched ProductResponse với approved quantities
        List<ProductResponse> result = listProduct.stream()
                .filter(p -> productDataMap.containsKey(p.getProductId()))
                .map(p -> {
                    ProductResponse response = enrich(p);
                    ProductClientRequest productData = productDataMap.get(p.getProductId());

                    // Set inventory data
                    response.setQuantity(productData.getQuantity());
                    response.setPendingApprovedImportQuantity(productData.getPendingApprovedImportQuantity());
                    response.setPendingApprovedExportQuantity(productData.getPendingApprovedExportQuantity());

                    return response;
                })
                .toList();

        log.info("✅ Returning {} enriched products with warehouse quantity and approved orders", result.size());
        return result;
    }




    @Override
    public ProductResponse getBySku(String sku) {
        Product product=productRepo.findBySkuAndIsDeleted(sku,false)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        Product productSave=productRepo.save(product);
        return  enrich(productSave);
    }

    @Override
    public ProductResponse updateProduct(ProductForm form, String productId) {
        Product product = getById(productId);
        productMapper.update(product, form);
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepo.save(product);

        // Update stock levels in InventoryService if changed
        if (form.minStockLevel() != null || form.maxStockLevel() != null) {
            UpdateStockLevelsRequest stockRequest = new UpdateStockLevelsRequest(
                    form.minStockLevel(),
                    form.maxStockLevel()
            );
            inventoryController.updateStockLevelsByProduct(productId, stockRequest);
        }

        return enrich(updatedProduct);
    }

    @Override
    public void deleteByProductId(String productId) {
        Product product=getById(productId);
        product.setIsDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        productRepo.save(product);
    }

    @Override
    public ProductResponse enrich(Product product) {
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl.getUserAsync(product.getCreateByUser());
        CompletableFuture<SupplierResponse> supplierFuture = asyncServiceImpl.getSupplierAsync(product.getSupplier());

        CompletableFuture.allOf(userFuture, supplierFuture).join();

        ProductResponse response = productMapper.toResponse(product);
        response.setCreateByUser(userFuture.join());
        response.setSupplier(supplierFuture.join());
        return response;
    }
}
