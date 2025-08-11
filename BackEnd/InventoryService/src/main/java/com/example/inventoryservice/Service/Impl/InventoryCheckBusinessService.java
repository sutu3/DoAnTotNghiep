package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import com.example.inventoryservice.Repo.InventoryCheckSheetRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryCheckBusinessService {
    private final InventoryCheckSheetRepo inventoryCheckSheetRepo;

    public InventoryCheckSheet getById(String id) {
        return inventoryCheckSheetRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_CHECK_SHEET_NOT_FOUND));
    }
}
