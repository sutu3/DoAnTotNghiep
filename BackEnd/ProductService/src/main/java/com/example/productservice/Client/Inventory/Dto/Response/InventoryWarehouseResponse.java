package com.example.productservice.Client.Inventory.Dto.Response;



import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

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
    Integer quantity;
    LocalDate expiryDate;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

    // Enriched fields từ external services
    ProductResponse productDetails;
    WarehousesResponse warehouseDetails;
}
