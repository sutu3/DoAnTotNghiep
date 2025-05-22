package com.ddd.warehouse.Dto.Response.User;

import com.ddd.warehouse.Enum.Userenum;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResponse(
    String userId,
    String userName,
    String fullName,
    String email,
    String urlImage,
    String password,
    String phoneNumber,
    Userenum status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Boolean isDeleted,
    LocalDateTime deletedAt
    // thiếu warehouseId
    //thiếu roleId
){
}
