package com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WarehouseCapacityResponse {
    private String warehouseId;
    private String warehouseName;
    private Integer totalBins;
    private Integer occupiedBins;
    private Integer availableBins;
    private Integer utilizationPercentage;
    private Integer totalCapacity;
    private Integer usedCapacity;
}
