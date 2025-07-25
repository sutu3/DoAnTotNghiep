package com.example.inventoryservice.Module;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DateRange {
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
}
