package com.example.userservice.Dto.Responses.Task;

import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponseNoList;
import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusTaskEnum;

import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse(
        String taskId,
        TaskTypeResponse taskType,
        StatusTaskEnum status,
        LevelEnum level,
        String description,
        List<TaskUserResponseNoList> taskUsers,
        LocalDateTime completeAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
