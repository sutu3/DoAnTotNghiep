package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseInventoryCheck {
    Integer totalBin;
    Integer availableBin;
    Integer utilizationPercentage;
    Integer totalCapacity;
    Integer usedCapacity;
    Integer emptyBin;

}
