package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Dtos.Request.InventoryWarehouseRequest;
import com.example.inventoryservice.Dtos.Response.InventoryWarehouseResponse;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryWarehouseForm;
import com.example.inventoryservice.Mapper.InventoryWarehouseMapper;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Module.InventoryWarehouse;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Repo.InventoryWarehouseRepo;
import com.example.inventoryservice.Service.InventoryProductService;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryWarehouseServiceImpl implements InventoryWarehouseService {

    InventoryWarehouseRepo inventoryWarehouseRepo;
    InventoryWarehouseMapper inventoryWarehouseMapper;
    InventoryProductService inventoryProductService;
    ProductController productController;
    WarehouseController warehouseController;
    AsyncServiceImpl asyncServiceImpl;
    InventoryProductRepo inventoryProductRepo;

    @Override
    public Page<InventoryWarehouseResponse> getAllByWarehouse(Pageable pageable, String warehouse) {
        return inventoryWarehouseRepo.findAllByWarehouseAndIsDeleted(warehouse, false, pageable)
                .map(this::enrich);
    }

    @Override
    public List<InventoryWarehouseResponse> getAllByBin(String bin) {
        return inventoryWarehouseRepo.findAllByBinAndIsDeleted(bin, false)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryWarehouse getById(String id) {
        return inventoryWarehouseRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_WAREHOUSE_NOT_FOUND));
    }

    @Override
    public InventoryWarehouseResponse getByIdResponse(String id) {
        return enrich(getById(id));
    }

    @Override
    public InventoryWarehouseResponse createInventoryWarehouse(InventoryWarehouseRequest request) {
        // Validate references
        InventoryProduct inventoryProduct = inventoryProductService
                .getByProductAndWarehouse(request.product(), request.warehouse());
        productController.getProductById(request.product());
        warehouseController.getWarehouse(request.warehouse());
        warehouseController.getBinById(request.bin());

        InventoryWarehouse inventoryWarehouse = inventoryWarehouseMapper.toEntity(request);
        inventoryWarehouse.setInventoryProduct(inventoryProduct);
        inventoryWarehouse.setIsDeleted(false);

        InventoryWarehouse savedWarehouse = inventoryWarehouseRepo.save(inventoryWarehouse);

        // Update total quantity in InventoryProduct
        updateInventoryProductTotalQuantity(inventoryProduct);

        return enrich(savedWarehouse);
    }

    @Override
    public InventoryWarehouseResponse updateInventoryWarehouse(InventoryWarehouseForm form, String id) {
        InventoryWarehouse inventoryWarehouse = getById(id);

        // Validate bin if changed
        if (!inventoryWarehouse.getBin().equals(form.bin())) {
            warehouseController.getBinById(form.bin());
        }

        inventoryWarehouseMapper.update(inventoryWarehouse, form);
        inventoryWarehouse.setUpdatedAt(LocalDateTime.now());

        InventoryWarehouse updatedWarehouse = inventoryWarehouseRepo.save(inventoryWarehouse);

        // Update total quantity in InventoryProduct
        updateInventoryProductTotalQuantity(inventoryWarehouse.getInventoryProduct());

        return enrich(updatedWarehouse);
    }

    @Override
    public void deleteInventoryWarehouse(String id) {
        InventoryWarehouse inventoryWarehouse = getById(id);
        inventoryWarehouse.setIsDeleted(true);
        inventoryWarehouse.setDeletedAt(LocalDateTime.now());
        inventoryWarehouseRepo.save(inventoryWarehouse);

        // Update total quantity in InventoryProduct
        updateInventoryProductTotalQuantity(inventoryWarehouse.getInventoryProduct());
    }

    @Override
    public List<InventoryWarehouseResponse> getExpiringProducts(LocalDate date) {
        return inventoryWarehouseRepo.findExpiringProducts(date)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean isBinEmpty(String bin) {
        return inventoryWarehouseRepo.isBinEmpty(bin);
    }

    @Override
    public InventoryWarehouseResponse enrich(InventoryWarehouse inventoryWarehouse) {
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(inventoryWarehouse.getProduct());
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(inventoryWarehouse.getWarehouse());
        CompletableFuture<BinResponse> binFuture = asyncServiceImpl
                .getBinAsync(inventoryWarehouse.getBin());
        InventoryWarehouseResponse response = inventoryWarehouseMapper.toResponse(inventoryWarehouse);
        response.setProductDetails(productFuture.join());
        response.setWarehouseDetails(warehouseFuture.join());
        response.setBinDetails(binFuture.join());

        return response;
    }

    private void updateInventoryProductTotalQuantity(InventoryProduct inventoryProduct) {
        Integer totalQuantity = inventoryWarehouseRepo
                .sumQuantityByProductAndWarehouse(
                        inventoryProduct.getProduct(),
                        inventoryProduct.getWarehouse()
                );
        inventoryProduct.setTotalQuantity(totalQuantity != null ? totalQuantity : 0);
        inventoryProduct.setUpdatedAt(LocalDateTime.now());
        inventoryProductRepo.save(inventoryProduct);
    }
}
