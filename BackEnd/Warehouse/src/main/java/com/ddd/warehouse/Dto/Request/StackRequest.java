package com.ddd.warehouse.Dto.Request;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;

@Builder
public record StackRequest(
        String stackName,
        String description,
        String warehouse,
        int binQuantity
) {
}
