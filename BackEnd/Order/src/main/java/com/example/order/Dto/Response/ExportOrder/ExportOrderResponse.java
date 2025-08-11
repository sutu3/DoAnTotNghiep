package com.example.order.Dto.Response.ExportOrder;

import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Module.BaseEntity;
import com.example.order.Module.ExportItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExportOrderResponse {

    String exportOrderId;

    WarehousesResponse warehouse;

    UserResponse createByUser;

    SupplierResponse customer;

    String description;

    LocalDateTime deliveryDate;
    Integer itemCount;


    String status ;

    BigDecimal totalAmount ;

    UserResponse approvedBy;

    LocalDateTime approvedDate;
    LocalDateTime createdAt;

//    List<ExportItem> exportItems;
}
