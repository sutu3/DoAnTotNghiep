package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Request.InventoryWarehouseRequest;
import com.example.inventoryservice.Dtos.Response.InventoryWarehouseResponse;
import com.example.inventoryservice.Form.InventoryWarehouseForm;
import com.example.inventoryservice.Module.InventoryWarehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface InventoryWarehouseService {
    Page<InventoryWarehouseResponse> getAllByWarehouse(Pageable pageable, String warehouse);
    List<InventoryWarehouseResponse> getAllByBin(String bin);
    InventoryWarehouse getById(String id);
    InventoryWarehouseResponse getByIdResponse(String id);
    InventoryWarehouseResponse createInventoryWarehouse(InventoryWarehouseRequest request);
    InventoryWarehouseResponse updateInventoryWarehouse(InventoryWarehouseForm form, String id);
    void deleteInventoryWarehouse(String id);
    List<InventoryWarehouseResponse> getExpiringProducts(LocalDate date);
    Boolean isBinEmpty(String bin);
    InventoryWarehouseResponse enrich(InventoryWarehouse inventoryWarehouse);
}
