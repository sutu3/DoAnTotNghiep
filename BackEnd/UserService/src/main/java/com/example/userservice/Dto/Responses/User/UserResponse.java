package com.example.userservice.Dto.Responses.User;

import com.example.userservice.Client.Authen.Dto.Response.RoleResponse;
import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponseNoList;
import com.example.userservice.Enum.StatusEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse{
    String userId;
    String userName;
    String fullName;
    String email;
    String urlImage;
    String phoneNumber;
    StatusEnum status;
    List<TaskUserResponseNoList> taskUsers;
    Set<RoleResponse> roles;
    WarehousesResponse warehouses;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    LocalDateTime deletedAt;
}
