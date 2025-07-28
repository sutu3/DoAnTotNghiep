package com.example.productservice.Client.Inventory.Dto.Response;

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
