package com.example.userservice.Dto.Responses.TaskUser;

import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Enum.StatusTaskUserEnum;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TaskUserResponseNoList(
        String id,
        StatusTaskUserEnum status,
        String note,
        LocalDateTime completeAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
