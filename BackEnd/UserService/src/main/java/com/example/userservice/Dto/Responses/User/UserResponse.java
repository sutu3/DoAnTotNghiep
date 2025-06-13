package com.example.userservice.Dto.Responses.User;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponseNoList;
import com.example.userservice.Enum.StatusEnum;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
@Builder
public record UserResponse(
        String userId,
        String userName,
        String fullName,
        String email,
        String urlImage,
        String phoneNumber,
        StatusEnum status,
        List<TaskUserResponseNoList> taskUsers,
        WarehousesResponse warehouses,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
