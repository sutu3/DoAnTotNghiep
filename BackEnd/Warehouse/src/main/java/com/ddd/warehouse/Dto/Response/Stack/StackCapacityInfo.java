package com.ddd.warehouse.Dto.Response.Stack;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StackCapacityInfo {
    private String stackId;
    private String stackName;
    private Integer totalBins;
    private Integer occupiedBins;
    private Integer emptyBins;
    private Double utilizationPercentage;
    private String status; // "critical", "warning", "normal"
}
