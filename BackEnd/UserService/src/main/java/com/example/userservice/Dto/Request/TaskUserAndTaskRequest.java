package com.example.userservice.Dto.Request;

import lombok.Builder;

import java.util.List;

@Builder
public record TaskUserAndTaskRequest(
        TaskRequest request
        , List<TaskUserRequest> tasks
) {
}
