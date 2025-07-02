package com.example.userservice.Dto.Request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskRequest(
        String taskType,
        String level,
        String description,
        String warehouses,
        LocalDate completeAt) {
}
