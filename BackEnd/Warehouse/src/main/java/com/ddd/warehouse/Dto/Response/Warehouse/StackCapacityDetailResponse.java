package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StackCapacityDetailResponse {
    private String stackId;
    private String stackName;
    private String description;
    private Integer totalBins;
    private Integer emptyBins;
    private Integer occupiedBins;
    private Integer maintenanceBins;
    private Double utilizationPercentage;
    private String status;                  // "critical", "warning", "normal"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
