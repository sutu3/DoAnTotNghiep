package com.example.userservice.Dto.Responses.TaskType;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskTypeResponseNoList {
        String taskTypeId;
        String taskName;
        String description;
        LocalDateTime createdAt;
        LocalDateTime updatedAt;
        Boolean isDeleted;
        LocalDateTime deletedAt;
}
