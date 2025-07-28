package com.example.inventoryservice.Dtos.Response;

import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Module.InventoryProduct;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryWarehouseResponse {
    String inventoryWarehouseId;
    String product;
    String warehouse;
    String bin;
    BigDecimal quantity;
    LocalDate expiryDate;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    InventoryProductResponseNoList inventoryProduct;

    // Enriched fields từ external services
    ProductResponse productDetails;
    WarehousesResponse warehouseDetails;
    BinResponse binDetails;
}
