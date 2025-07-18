package com.example.order.Client.Inventory.Dto.Resquest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockMovementRequest {
    private String inventoryWarehouseId;
    private String product;
    private String movementType;
    private Integer quantity;
    private String referenceOrderId;
    private String performedBy;
    private String note;
    private BigDecimal unitCost;
}

