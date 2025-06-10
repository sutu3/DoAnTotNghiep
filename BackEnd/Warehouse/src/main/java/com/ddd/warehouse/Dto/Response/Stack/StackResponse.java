package com.ddd.warehouse.Dto.Response.Stack;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StackResponse(
        String stackId,
        String stackName,
        String description,
        String warehouse,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
