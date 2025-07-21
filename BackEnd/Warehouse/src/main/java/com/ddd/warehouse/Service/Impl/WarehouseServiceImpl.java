package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Client.UserService.Dto.Response.UserResponse;
import com.ddd.warehouse.Client.UserService.Redis.UserController;
import com.ddd.warehouse.Client.UserService.UserClient;
import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Mapper.WarehouseMapper;
import com.ddd.warehouse.Module.Warehouses;
import com.ddd.warehouse.Repo.WarehouseRepo;
import com.ddd.warehouse.Service.WarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class WarehouseServiceImpl implements WarehouseService {
    WarehouseMapper warehouseMapper;
    WarehouseRepo warehouseRepo;
    UserController userController;
    private final UserClient userClient;

    @Override
    public Page<WarehousesResponse> getAll(Pageable pageable) {
        return warehouseRepo.findAllByIsDeletedFalse( pageable)
                .map(warehouseMapper::toResponse);
    }

    @Override
    public List<WarehousesResponse> getAllList() {
        return warehouseRepo.findAllByIsDeleted(false)
                .stream().map(warehouseMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public WarehousesResponse getByManagerId(String managerId) {
        return warehouseMapper.toResponse(warehouseRepo.findByManagerId(managerId)
                .orElseThrow(()->new AppException(ErrorCode.WAREHOUSE_NOT_FOUND)));
    }

    @Override
    public WarehousesResponse getByStaffId() {
        var idUser=GetCurrentUserId.getCurrentUserId();
        String warehouseId=userClient.getIdWarehouseByIdUser().getResult().getWarehouseId();
        Warehouses warehouse=getById(warehouseId);
        return warehouseMapper.toResponse(warehouse);
    }

    @Override
    public Warehouses getById(String warehouseId) {
        return warehouseRepo.findById(warehouseId)
                .orElseThrow(()->new AppException(ErrorCode.WAREHOUSE_NOT_FOUND));
    }

    @Override
    public Boolean exsistByManagerId(String managerId) {
        return warehouseRepo.existsByManagerId(managerId);
    }

    @Override
    public WarehousesResponse getByIdResponse(String warehouseId) {
        return warehouseMapper.toResponse(getById(warehouseId));
    }

    @Override
    public Page<WarehousesResponse> getByName(String warehouseName, Pageable pageable) {
        return warehouseRepo.findByWarehouseName(warehouseName, pageable).map(warehouseMapper::toResponse);
    }

    @Override
    public WarehousesResponse createWarehouse(WarehousesRequest request) {
        if(exsistByManagerId(request.managerId())){
            throw new AppException(ErrorCode.WAREHOUSE_EXIST);
        }
        Warehouses warehouses=warehouseMapper.toEntity(request);
        warehouses.setIsDeleted(false);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public WarehousesResponse updateWarehouse(String warehouseId, WarehousesForm update) {
        Warehouses warehouses=getById(warehouseId);
        warehouseMapper.update(warehouses,update);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public WarehousesResponse updateAddress(AddressForm addressForm, String warehouseId) {
        Warehouses warehouses=getById(warehouseId);
        warehouseMapper.updateAddress(warehouses,addressForm);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public String deleteWarehouse(String warehouseId) {
        Warehouses warehouses=getById(warehouseId);
        warehouses.setIsDeleted(true);
        warehouses.setDeletedAt(LocalDateTime.now());
        warehouseRepo.save(warehouses);
        return "Deleted Completed";
    }

}
