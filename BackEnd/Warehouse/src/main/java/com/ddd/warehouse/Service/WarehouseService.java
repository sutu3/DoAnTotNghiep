package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Module.Warehouses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface WarehouseService {
    Page<WarehousesResponse> getAll(Pageable pageable);
    WarehousesResponse getByManagerId(String managerId);
    Warehouses getById(String warehouseId);
    Boolean exsistByManagerId(String managerId);
    WarehousesResponse getByIdResponse(String warehouseId);
    Page<WarehousesResponse> getByName(String warehouseName,Pageable pageable);
    WarehousesResponse createWarehouse(WarehousesRequest request);
    WarehousesResponse updateWarehouse(String warehouseId, WarehousesForm update);
    WarehousesResponse updateAddress(AddressForm addressForm,String warehouseId);
    String deleteWarehouse(String warehouseId);

}
