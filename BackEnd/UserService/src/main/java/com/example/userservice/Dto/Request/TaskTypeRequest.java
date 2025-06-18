package com.example.userservice.Dto.Request;

import jakarta.persistence.Column;
import lombok.Builder;

@Builder
public record TaskTypeRequest(
        String taskName,
        String description,
        String warehouses
) {
}
