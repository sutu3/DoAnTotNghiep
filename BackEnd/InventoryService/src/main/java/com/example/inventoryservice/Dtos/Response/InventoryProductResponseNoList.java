package com.example.inventoryservice.Dtos.Response;


import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryProductResponseNoList {
    String inventoryProductId;
    Integer totalQuantity;
    Integer minStockLevel;
    Integer maxStockLevel;
    LocalDateTime lastImportDate;
    LocalDateTime lastExportDate;
    String status;
}
