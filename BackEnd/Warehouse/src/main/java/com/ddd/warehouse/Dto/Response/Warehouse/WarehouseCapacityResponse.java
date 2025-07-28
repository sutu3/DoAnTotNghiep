package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseCapacityResponse {
    private String warehouseId;
    private String warehouseName;
    private Integer totalBins;
    private Integer occupiedBins;
    private Integer availableBins;
    private Integer utilizationPercentage;
    private BigDecimal totalCapacity;
    private BigDecimal usedCapacity;
}
