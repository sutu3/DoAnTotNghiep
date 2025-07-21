package com.example.productservice.Service.Impl;

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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
     UserController userController;
     CategoryService categoryService;
     UnitService unitService;
    private final AsyncServiceImpl asyncServiceImpl;
    private final InventoryController inventoryController;

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
                        0,
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
                    0,
                    request.minStockLevel(),
                    request.maxStockLevel(),
                    "Active");
            inventoryController.createInventoryProduct(inventoryProductRequest);
        }
        return  enrich(productSave);
    }

    @Override
    public List<ProductResponse> getProductsBySupplierFilteredByWarehouse(String supplierId, String warehouseId) {
        log.info("Start");
        Specification<Product> spec = Specification.where(ProductSpecification.hasSupplier(supplierId))
                .and(ProductSpecification.isActive(true));

        log.info("📦 [Product Filter] - Specification created for supplierId={} and isActive=true", supplierId);

        List<Product> listProduct = productRepo.findAll(spec);
        log.info("🔍 [Product Filter] - Found {} products for supplierId={}", listProduct.size(), supplierId);

        if (listProduct.isEmpty()) {
            log.warn("⚠️ [Product Filter] - No products found for supplierId={}", supplierId);
        }

        log.info("🏬 [Warehouse Filter] - Filtering products for warehouseId={}", warehouseId);
        ProductFilterRequest request = new ProductFilterRequest(
                warehouseId,
                listProduct.stream().map(productMapper::toClientRequest).toList()
        );

        List<ProductClientRequest> filteredProductDtos = inventoryController
                .filterProductsByWarehouse(request)
                .getResult();

        log.info("🏬 [Warehouse Filter] - Done");

        if (filteredProductDtos == null || filteredProductDtos.isEmpty()) {
            log.warn("⚠️ [Warehouse Filter] - No products matched in warehouseId={}", warehouseId);
            return List.of();
        }

        // 🔁 Lọc lại danh sách gốc theo ID trong danh sách đã lọc
        Set<String> filteredProductIds = filteredProductDtos.stream()
                .map(ProductClientRequest::getProductId)
                .collect(Collectors.toSet());

        List<Product> filteredFullProducts = listProduct.stream()
                .filter(product -> filteredProductIds.contains(product.getProductId()))
                .toList();

        log.info("✅ [Result] - Returning {} enriched products", filteredFullProducts.size());

        // ✨ enrich để trả về đầy đủ thông tin
        return filteredFullProducts.stream()
                .map(this::enrich)
                .toList();
    }



    @Override
    public ProductResponse getBySku(String sku) {
        Product product=productRepo.findBySkuAndIsDeleted(sku,false)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        Product productSave=productRepo.save(product);
        return  enrich(productSave);
    }

    @Override
    public ProductResponse updateProduct(ProductForm update, String productId) {
        Product product = getById(productId);
        productMapper.update(product,update);
        Product productUpdate=productRepo.save(product);
        Product productSave=productRepo.save(productUpdate);
        return  enrich(productSave);
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
