package com.example.userservice.Service;


import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service

public interface AsyncService {
    CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId);
}
