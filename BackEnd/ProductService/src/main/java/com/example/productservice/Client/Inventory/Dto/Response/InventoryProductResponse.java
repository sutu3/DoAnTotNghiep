package com.example.productservice.Client.Inventory.Dto.Response;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class InventoryProductResponse {
    String inventoryProductId;
    String product;
    String warehouse;
    Integer totalQuantity;
    Integer minStockLevel;
    Integer maxStockLevel;
    LocalDateTime lastImportDate;
    LocalDateTime lastExportDate;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;

}
