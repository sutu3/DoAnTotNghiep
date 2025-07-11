package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Response.InventoryStatsResponse;
import com.example.inventoryservice.Dtos.Response.SuggestedLocationStats;
import com.example.inventoryservice.Dtos.Response.WarehouseCapacityStats;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InventoryStatsService {
    InventoryStatsResponse getProductInventoryStats(String productId, String warehouseId);
    WarehouseCapacityStats getWarehouseCapacityStats(String warehouseId);
    List<SuggestedLocationStats> getSuggestedLocations(String productId, String warehouseId);
}
