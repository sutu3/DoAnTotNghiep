package com.example.inventoryservice.Dtos.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStockLevelsRequest {
    Integer minStockLevel;
    Integer maxStockLevel;
}
