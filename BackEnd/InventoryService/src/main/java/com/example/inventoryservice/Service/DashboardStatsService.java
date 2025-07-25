package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Response.DashboardStatsResponse;
import com.example.inventoryservice.Module.DateRange;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public interface DashboardStatsService {
    DashboardStatsResponse getDashboardStats(String warehouseId, String timeFilter);
}
