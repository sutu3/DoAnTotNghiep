package com.example.userservice.Dto.Responses.TaskUser;

import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Enum.StatusTaskUserEnum;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TaskUserResponse(
        String id,
        TaskResponse task,
        UserResponse user,
        StatusTaskUserEnum status,
        String note,
        LocalDateTime completeAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
