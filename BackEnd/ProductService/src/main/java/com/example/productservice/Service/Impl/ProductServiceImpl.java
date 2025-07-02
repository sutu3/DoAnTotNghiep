package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.SupplierResponse;
import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Client.WarehouseService.WarehouseController;
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
import com.example.productservice.Service.CategoryService;
import com.example.productservice.Service.ProductService;
import com.example.productservice.Service.UnitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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

    @Override
    public Page<ProductResponse> getAllByWarehouses(String warehouse, Pageable pageable) {
        return productRepo.findAllByWarehousesAndIsDeleted(warehouse, false, pageable)
                .map(this::enrich);
    }


    @Override
    public Page<ProductResponse> getAllBySupplierAndWarehouse(String supplier, String warehouse, Pageable pageable) {
        return productRepo.findAllBySupplierAndWarehousesAndIsDeleted(supplier, warehouse, false, pageable)
                .map(this::enrich);
    }


    @Override
    public Product getById(String id) {
        return productRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public ProductResponse getByIdResponse(String id) {
        Product product = getById(id);
        ProductResponse productResponse=productMapper.toResponse(product);
        UserResponse userResponse=userController.getUser(product.getCreateByUser()).getResult();
        WarehousesResponse warehousesResponse=warehouseController.getWarehouse(product.getWarehouses()).getResult();
        return productMapper.updateCreateByUser(
                productMapper.updateWarehouse(productResponse,warehousesResponse),userResponse);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category=categoryService.getById(request.category());
        Unit unit=unitService.getById(request.unit());
        WarehousesResponse warehousesResponse=warehouseController
                .getWarehouse(request.warehouses()).getResult();
        UserResponse userResponse=userController
                .getUser(request.createByUser()).getResult();
        Optional<Product> existing=productRepo.findBySkuAndWarehouses(request.sku(),request.warehouses());
        if(existing.isPresent()){
            Product  product=existing.get();
            if(!product.getIsDeleted()){
                throw new AppException(ErrorCode.PRODUCT_EXISTS);
            }
            productMapper.updateResquest(product,request);
            product.setCategory(category);
            product.setUnit(unit);
            product.setIsDeleted(false);
            ProductResponse productResponse=productMapper.toResponse(productRepo.save(product));
            return  productMapper.updateCreateByUser(
                    productMapper.updateWarehouse(productResponse,warehousesResponse),userResponse);
        }
        Product product=productMapper.toEntity(request);
        product.setCategory(category);
        product.setUnit(unit);
        product.setIsDeleted(false);
        product.setIsActive(true);
        ProductResponse productResponse=productMapper.toResponse(productRepo.save(product));
        return  productMapper.updateCreateByUser(
                productMapper.updateWarehouse(productResponse,warehousesResponse),userResponse);
    }

    @Override
    public ProductResponse getBySku(String sku) {
        Product product=productRepo.findBySkuAndIsDeleted(sku,false)
                .orElseThrow(()->new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        UserResponse userResponse=userController.getUser(product.getCreateByUser()).getResult();
        WarehousesResponse warehousesResponse=warehouseController.getWarehouse(product.getWarehouses()).getResult();
        ProductResponse productResponse=productMapper.toResponse(product);
        return productMapper.updateCreateByUser(
                productMapper.updateWarehouse(productResponse,warehousesResponse),userResponse);
    }

    @Override
    public ProductResponse updateProduct(ProductForm update, String productId) {
        Product product = getById(productId);
        productMapper.update(product,update);
        Product productUpdate=productRepo.save(product);
        UserResponse userResponse=userController.getUser(productUpdate.getCreateByUser()).getResult();
        WarehousesResponse warehousesResponse=warehouseController.getWarehouse(productUpdate.getWarehouses()).getResult();
        ProductResponse productResponse=productMapper.toResponse(productUpdate);
        return productMapper.updateCreateByUser(
                productMapper.updateWarehouse(productResponse,warehousesResponse),userResponse);
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
        UserResponse userResponse = userController.getUser(product.getCreateByUser()).getResult();
        WarehousesResponse warehousesResponse = warehouseController.getWarehouse(product.getWarehouses()).getResult();
        SupplierResponse supplierResponse=userController.getSupplier(product.getSupplier()).getResult();
        ProductResponse productResponse = productMapper.toResponse(product);
        ProductResponse productResponseWarehouse = productMapper.updateWarehouse(productResponse, warehousesResponse);
        ProductResponse productResponseSupplier = productMapper.updateSupplier(productResponseWarehouse, supplierResponse);
        return productMapper.updateCreateByUser(productResponseSupplier, userResponse);
    }
}
