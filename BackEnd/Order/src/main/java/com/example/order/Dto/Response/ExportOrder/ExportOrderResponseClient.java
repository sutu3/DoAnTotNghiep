package com.example.order.Dto.Response.ExportOrder;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExportOrderResponseClient {
    private String exportOrderId;
    private String warehouseId;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime completedDate;
    private BigDecimal totalAmount;
    private String createByUser;
}
