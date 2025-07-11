package com.example.order.Dto.Response.ImportOrder;

import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Dto.Response.ImportItem.ImportResponseItemNoList;
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
public class ImportOrderResponse {
    String importOrderId;
    WarehousesResponse warehouse;
    String status;
    String type;
    UserResponse createByUser;
    UserResponse accessByAdmin;
    Integer itemCount;
    BigDecimal totalPrice;
    String note;
    String imageCheckUrl;
    LocalDateTime requestDate;
    LocalDateTime accessDate;
    List<ImportResponseItem> importItems;
}
