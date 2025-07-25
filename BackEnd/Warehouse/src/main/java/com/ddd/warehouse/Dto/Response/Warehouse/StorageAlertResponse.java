package com.ddd.warehouse.Dto.Response.Warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageAlertResponse {
    private String type;                    // "critical", "warning", "info"
    private String title;
    private String message;
    private String stackId;
    private String stackName;
    private Double utilizationPercentage;
    private String severity;                // "HIGH", "MEDIUM", "LOW"
    private LocalDateTime createdAt;
}
