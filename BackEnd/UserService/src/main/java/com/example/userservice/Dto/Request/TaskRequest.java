package com.example.userservice.Dto.Request;

public record TaskRequest(
        String taskType,
        String level,
        String description,
        String warehouses
) {
}
