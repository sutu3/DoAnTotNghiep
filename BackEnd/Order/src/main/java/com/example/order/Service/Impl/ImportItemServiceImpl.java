package com.example.order.Service.Impl;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.UserService.UserController;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Client.WarehouseService.WarehouseController;
import com.example.order.Dto.Request.ImportRequestItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.ImportItemForm;
import com.example.order.Mapper.ImportItemMapper;
import com.example.order.Module.ImportItem;
import com.example.order.Repo.ImportItemRepo;
import com.example.order.Service.ImportItemService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public Page<ImportResponseItem> getAllByWarehouse(Pageable pageable, String warehouse) {
        return importItemRepo.findAllByWarehouseAndIsDeleted(warehouse, false, pageable).map(
                this::toResponse
        );
    }

    @Override
    public ImportItem getById(String id) {
        return importItemRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.IMPORT_ITEM_NOT_FOUND));
    }

    @Override
    public ImportResponseItem getByIdResponse(String id) {
        return toResponse(getById(id));
    }

    @Override
    public ImportResponseItem createItem(ImportRequestItem requestItem) {
        ImportItem importItem=importItemMapper.toEntity(requestItem);
        importItem.setIsDeleted(false);
        return toResponse(importItemRepo.save(importItem));
    }

    @Override
    public ImportResponseItem updateItem(ImportItemForm update, String id) {
        ImportItem importItem=importItemRepo.getById(id);
        importItemMapper.toUpdate(importItem,update);
        return toResponse(importItemRepo.save(importItem));
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
    public ImportResponseItem toResponse(ImportItem importItem) {
        UserResponse userResponse=userController
                .getUser(importItem.getCreateByUser()).getResult();
        SupplierResponse supplierResponse=userController
                .getSupplier(importItem.getSupplier()).getResult();
        ProductResponse productResponse=productController
                .getProductById(importItem.getProduct()).getResult();
        WarehousesResponse warehousesResponse=warehouseController
                .getWarehouse(importItem.getWarehouse()).getResult();
        UnitNameResponse unitNameResponse=productController
                .getUnitById(importItem.getUnit()).getResult();
        ImportResponseItem importResponseItem=importItemMapper.toResponse(importItem);
        importResponseItem.setCreateByUser(userResponse);
        importResponseItem.setSupplier(supplierResponse);
        importResponseItem.setProduct(productResponse);
        importResponseItem.setWarehouse(warehousesResponse);
        importResponseItem.setUnit(unitNameResponse);
        return importResponseItem;
    }
}
