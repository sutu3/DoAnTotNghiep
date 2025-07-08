package com.example.order.Service.Impl;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportItemForm;
import com.example.order.Mapper.ImportItemMapper;
import com.example.order.Module.ImportItem;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportItemRepo;
import com.example.order.Repo.ImportOrderRepo;
import com.example.order.Service.ImportItemService;
import com.example.order.Service.ImportOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ImportItemServiceImpl implements ImportItemService {
    UserController userController;
    ProductController productController;
    WarehouseController warehouseController;
    ImportItemMapper importItemMapper;
    ImportItemRepo importItemRepo;
    private final ImportOrderRepo importOrderRepo;
    private final AsyncServiceImpl asyncServiceImpl;
    private final ImportOrderService importOrderService;

    @Override
    public Page<ImportResponseItem> getAllByWarehouse(Pageable pageable, String warehouse) {
        return importItemRepo.findAllByWarehouseAndIsDeleted(warehouse, false, pageable)
                .map(this::entry);
    }

    @Override
    public Page<ImportResponseItem> getAllByOrder(Pageable pageable, String order) {
        importOrderRepo.findById(order).orElseThrow(()->new AppException(ErrorCode.IMPORT_ORDER_NOT_FOUND));
        return importItemRepo.findAllByImportOrder_ImportOrderIdAndIsDeleted(order, false, pageable)
                .map(this::entry);
    }

    @Override
    public ImportItem getById(String id) {
        return importItemRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ITEM_NOT_FOUND));
    }

    @Override
    public ImportResponseItem getByIdResponse(String id) {
        return entry(getById(id));
    }

    @Override
    public ImportResponseItem createItem(ImportRequestItem requestItem) {
        ImportOrder importOrder= importOrderService.getById(requestItem.importOrder());
        ImportItem importItem=importItemMapper.toEntity(requestItem);
        importItem.setImportOrder(importOrder);
        importItem.setIsDeleted(false);
        ImportItem importItemSave=importItemRepo.save(importItem);
        return entry(importItemSave);
    }

    @Override
    public ImportResponseItem updateItem(ImportItemForm update, String id) {
        ImportItem importItem=importItemRepo.getById(id);
        importItemMapper.toUpdate(importItem,update);
        ImportItem importItemSave=importItemRepo.save(importItem);
        return entry(importItemSave);
    }
    @Override
    public List<ImportResponseItem> createItems(List<ImportRequestItem> requests) {
        return requests.stream()
                .map(this::createItem)
                .toList();
    }

    @Override
    public void deleteItem(String id) {
        ImportItem importItem=importItemRepo.getById(id);
        importItemRepo.deleteById(importItem.getItemId());
    }

    @Override
    public ImportResponseItem entry(ImportItem importItem) {
        CompletableFuture<UnitNameResponse> unitFuture=asyncServiceImpl
                .getUnitAsync(importItem.getUnit());
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(importItem.getProduct());
        CompletableFuture<SupplierResponse> supplierFuture = asyncServiceImpl
                .getSupplierAsync(importItem.getSupplier());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(importItem.getCreateByUser());
        CompletableFuture.allOf( unitFuture,productFuture,supplierFuture,userFuture).join();
        ImportResponseItem importResponseItem=importItemMapper.toResponse(importItem);
        importResponseItem.setCreateByUser(userFuture.join());
        importResponseItem.setSupplier(supplierFuture.join());
        importResponseItem.setProduct(productFuture.join());
        importResponseItem.setUnit(unitFuture.join());
        return importResponseItem;
    }
}
