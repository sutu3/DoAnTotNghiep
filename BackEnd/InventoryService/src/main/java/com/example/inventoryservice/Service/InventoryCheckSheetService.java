package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Request.InventoryCheckSheetRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckSheetResponse;
import com.example.inventoryservice.Form.AttachmentUrl;
import com.example.inventoryservice.Form.InventoryCheckSheetForm;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface InventoryCheckSheetService {
    Page<InventoryCheckSheetResponse> getAllByWarehouse(Pageable pageable, String warehouseId);
    Page<InventoryCheckSheetResponse> getAllByPerformedBy(Pageable pageable);
    InventoryCheckSheet getById(String id);
    InventoryCheckSheetResponse getByIdResponse(String id);
    InventoryCheckSheetResponse createInventoryCheckSheet(InventoryCheckSheetRequest request);
    InventoryCheckSheetResponse updateInventoryCheckSheet(InventoryCheckSheetForm form, String id);
    InventoryCheckSheetResponse updateStatusCompleted(String checkSheetId);

    InventoryCheckSheetResponse updateStatusApprove(String checkSheetId, AttachmentUrl attachmentUrl);
    void deleteInventoryCheckSheet(String id);
    List<InventoryCheckSheetResponse> getByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    InventoryCheckSheetResponse processCheckSheet(String id);
    InventoryCheckSheetResponse enrich(InventoryCheckSheet checkSheet);
}
