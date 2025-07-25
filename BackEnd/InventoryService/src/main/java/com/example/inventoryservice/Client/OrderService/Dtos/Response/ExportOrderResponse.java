package com.example.inventoryservice.Client.OrderService.Dtos.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExportOrderResponse {
    private String exportOrderId;
    private String warehouseId;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime completedDate;
    private BigDecimal totalAmount;
    private String createByUser;
}
