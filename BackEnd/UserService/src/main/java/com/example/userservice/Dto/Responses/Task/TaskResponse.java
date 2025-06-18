package com.example.userservice.Dto.Responses.Task;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponseNoList;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponseNoList;
import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskResponse{
    String taskId;
    TaskTypeResponseNoList taskType;
    StatusTaskEnum status;
    LevelEnum level;
    String description;
    List<TaskUserResponseNoList> taskUsers;
    WarehousesResponse warehouses;
    LocalDateTime completeAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    LocalDateTime deletedAt;
}
