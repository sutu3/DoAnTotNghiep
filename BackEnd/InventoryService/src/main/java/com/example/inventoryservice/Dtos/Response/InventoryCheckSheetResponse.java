package com.example.inventoryservice.Dtos.Response;

import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Enum.CheckSheetStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckSheetResponse {
    String checkSheetId;
    String checkSheetNumber;
    String warehouse;
    String performedBy;
    LocalDateTime checkDate;
    CheckSheetStatus status;
    String notes;
    String attachmentUrl;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Enriched data
    WarehousesResponse warehouseDetails;
    UserResponse performedByDetails;
    List<InventoryCheckDetailResponse> checkDetails;
}
