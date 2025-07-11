package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Request.StockMovementRequest;
import com.example.inventoryservice.Dtos.Response.StockMovementResponse;
import com.example.inventoryservice.Enum.MovementType;
import com.example.inventoryservice.Module.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface StockMovementService {
    Page<StockMovementResponse> getAllByProduct(Pageable pageable, String product);
    Page<StockMovementResponse> getAllByInventoryWarehouse(Pageable pageable, String inventoryWarehouseId);
    StockMovement getById(String id);
    StockMovementResponse getByIdResponse(String id);
    StockMovementResponse createStockMovement(StockMovementRequest request);
    void updateBinOccupancy(String binId, Integer quantityChange, MovementType movementType);
    List<StockMovementResponse> getMovementsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    StockMovementResponse enrich(StockMovement stockMovement);
}
