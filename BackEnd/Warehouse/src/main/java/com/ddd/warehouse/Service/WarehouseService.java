package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.Stack.NearFullStacksResponse;
import com.ddd.warehouse.Dto.Response.Warehouse.*;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Module.Warehouses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface WarehouseService {
    Page<WarehousesResponse> getAll(Pageable pageable);
    List<WarehousesResponse> getAllList();
    WarehousesResponse getByManagerId(String managerId);
    WarehousesResponse getByStaffId();
    Warehouses getById(String warehouseId);
    Boolean exsistByManagerId(String managerId);
    WarehousesResponse getByIdResponse(String warehouseId);
    Page<WarehousesResponse> getByName(String warehouseName,Pageable pageable);
    WarehousesResponse createWarehouse(WarehousesRequest request);
    WarehousesResponse updateWarehouse(String warehouseId, WarehousesForm update);
    WarehousesResponse updateAddress(AddressForm addressForm,String warehouseId);
    String deleteWarehouse(String warehouseId);
    WarehouseCapacityResponse getWarehouseCapacity(String warehouseId);
    WarehouseInventoryCheck getWarehouseInventoryCheck(String warehouseId);
    NearFullStacksResponse getNearFullStacks(String warehouseId, Integer threshold);
    WarehouseCapacityStatsResponse getCapacityStats(String warehouseId, String timeFilter);
    List<StorageAlertResponse> getStorageAlerts(String warehouseId);
    List<StackCapacityDetailResponse> getStackCapacityDetails(String warehouseId);
}
