package com.example.order.Dto.Response.ImportItem;

import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.SupplierResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;

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
public class ImportResponseItem {
    String itemId;
    ProductResponse product;
    SupplierResponse supplier;
    UnitNameResponse unit;
    UserResponse createByUser;
    BinResponse bin;
    LocalDateTime ExpiredDate;
    int requestQuantity;
    String note;
    int realityQuantity;
    BigDecimal costUnitBase ;
    LocalDateTime importAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
