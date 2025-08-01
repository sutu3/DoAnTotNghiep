package com.example.userservice.Service.Impl;


import com.example.userservice.Client.Authen.AuthenController;
import com.example.userservice.Client.Authen.Dto.Response.RoleResponse;
import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.userservice.Service.AsyncService;
import com.example.userservice.Util.TokenContextHolder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class AsyncServiceImpl implements AsyncService {
    WarehouseController warehouseController;
    private final AuthenController authenController;


    @Override
    public CompletableFuture<WarehousesResponse> getWarehouseAsync(String warehouseId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return  warehouseController.getWarehouse(warehouseId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });
    }

    @Override
    public CompletableFuture<Set<RoleResponse>> getRoleAsync(String userId) {
        String token = TokenContextHolder.getCurrentToken();
        return CompletableFuture.supplyAsync(() -> {
            TokenContextHolder.setToken(token);
            try {
                return  authenController.getRoleByUserId(userId).getResult();
            } finally {
                TokenContextHolder.clear();
            }
        });    }


}
