package com.example.order.Dto.Response.ImportOrder;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportOrderResponseClient {
     String importOrderId;
     String warehouseId;
     String status;
     LocalDateTime requestDate;
     LocalDateTime completedDate;
     BigDecimal totalAmount;
     String createByUser;
}