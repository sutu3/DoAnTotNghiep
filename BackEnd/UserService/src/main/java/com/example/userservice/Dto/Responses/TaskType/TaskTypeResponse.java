package com.example.userservice.Dto.Responses.TaskType;

import java.time.LocalDateTime;

public record TaskTypeResponse(
        String taskTypeId,
        String taskName,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
        ) {
}
