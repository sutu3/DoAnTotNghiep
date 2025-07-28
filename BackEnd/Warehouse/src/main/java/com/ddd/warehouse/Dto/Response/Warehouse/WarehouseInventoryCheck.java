package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseInventoryCheck {
    Integer totalBin;
    Integer availableBin;
    Integer utilizationPercentage;
    BigDecimal totalCapacity;
    BigDecimal usedCapacity;
    Integer emptyBin;

}
