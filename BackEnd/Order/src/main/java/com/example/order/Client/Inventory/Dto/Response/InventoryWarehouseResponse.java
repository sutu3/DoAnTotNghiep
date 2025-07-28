package com.example.order.Client.Inventory.Dto.Response;


import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
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

    // Enriched fields từ external services
    ProductResponse productDetails;
    WarehousesResponse warehouseDetails;
    BinResponse binDetails;
}
