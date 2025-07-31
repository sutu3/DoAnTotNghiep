package com.example.inventoryservice.Service;

import com.example.inventoryservice.Dtos.Request.InventoryCheckDetailRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckDetailResponse;
import com.example.inventoryservice.Form.InventoryCheckDetailForm;
import com.example.inventoryservice.Module.InventoryCheckDetail;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public interface InventoryCheckDetailService {
    List<InventoryCheckDetailResponse> getAllByCheckSheetId(String checkSheetId);
    InventoryCheckDetail getById(String id);
    InventoryCheckDetailResponse getByIdResponse(String id);
    InventoryCheckDetailResponse createInventoryCheckDetail(InventoryCheckDetailRequest request, String checkSheetId);
    InventoryCheckDetailResponse updateInventoryCheckDetail(InventoryCheckDetailForm update, String id);
    void deleteInventoryCheckDetail(String id);
    List<InventoryCheckDetail> getDiscrepanciesByCheckSheetId(String checkSheetId);
    BigDecimal getTotalDiscrepancyByCheckSheetId(String checkSheetId);
    InventoryCheckDetailResponse enrich(InventoryCheckDetail detail);
}
