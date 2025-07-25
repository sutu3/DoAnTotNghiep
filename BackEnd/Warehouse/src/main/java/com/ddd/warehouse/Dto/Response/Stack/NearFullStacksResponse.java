package com.ddd.warehouse.Dto.Response.Stack;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// BackEnd/Warehouse/src/main/java/com/ddd/warehouse/Dto/Response/NearFullStacksResponse.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearFullStacksResponse {
    private String warehouseId;
    private String warehouseName;
    private Integer totalStacks;
    private Integer nearFullStacksCount;
    private Double nearFullPercentage;
    private List<StackCapacityInfo> nearFullStacks;
}
