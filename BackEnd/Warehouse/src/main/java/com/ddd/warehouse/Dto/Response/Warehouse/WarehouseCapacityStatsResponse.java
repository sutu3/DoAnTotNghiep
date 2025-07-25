package com.ddd.warehouse.Dto.Response.Warehouse;

import com.ddd.warehouse.Dto.Response.Stack.StackCapacityInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseCapacityStatsResponse {
    private Integer totalBins;           // Tổng số bins
    private Integer emptyBins;           // Bin trống
    private Integer occupiedBins;        // Bin đã sử dụng
    private Integer utilizationPercentage; // Phần trăm sử dụng
    private Integer criticalStacks;      // Stack gần đầy
    private Integer warningStacks;       // Stack cảnh báo
    private List<StackCapacityInfo> stackDetails;
}
