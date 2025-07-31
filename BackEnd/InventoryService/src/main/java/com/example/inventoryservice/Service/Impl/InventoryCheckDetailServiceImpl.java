package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Dtos.Request.InventoryCheckDetailRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckDetailResponse;
import com.example.inventoryservice.Enum.CheckSheetStatus;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryCheckDetailForm;
import com.example.inventoryservice.Mapper.InventoryCheckDetailMapper;
import com.example.inventoryservice.Module.InventoryCheckDetail;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import com.example.inventoryservice.Repo.InventoryCheckDetailRepo;
import com.example.inventoryservice.Service.InventoryCheckDetailService;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryCheckDetailServiceImpl implements InventoryCheckDetailService {

    InventoryCheckDetailRepo inventoryCheckDetailRepo;
    InventoryCheckDetailMapper inventoryCheckDetailMapper;
    InventoryWarehouseService inventoryWarehouseService;
    private final InventoryCheckBusinessService inventoryCheckBusinessService;

    @Override
    public List<InventoryCheckDetailResponse> getAllByCheckSheetId(String checkSheetId) {
        return inventoryCheckDetailRepo.findAllByCheckSheet_CheckSheetId(checkSheetId)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryCheckDetail getById(String id) {
        return inventoryCheckDetailRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_CHECK_DETAIL_NOT_FOUND));
    }

    @Override
    public InventoryCheckDetailResponse getByIdResponse(String id) {
        return enrich(getById(id));
    }

    @Override
    public InventoryCheckDetailResponse createInventoryCheckDetail(InventoryCheckDetailRequest request, String checkSheetId) {
        // Validate check sheet exists
        InventoryCheckSheet checkSheet = inventoryCheckBusinessService.getById(checkSheetId);

        // Validate inventory warehouse exists
        inventoryWarehouseService.getById(request.getInventoryWarehouseId());

        InventoryCheckDetail detail = inventoryCheckDetailMapper.toEntity(request);
        detail.setCheckSheet(checkSheet);

        InventoryCheckDetail savedDetail = inventoryCheckDetailRepo.save(detail);
        return enrich(savedDetail);
    }

    @Override
    public InventoryCheckDetailResponse updateInventoryCheckDetail(InventoryCheckDetailForm update, String id) {
        InventoryCheckDetail detail = getById(id);

        // Only allow updates if check sheet is still in DRAFT status
        if (detail.getCheckSheet().getStatus() != CheckSheetStatus.DRAFT) {
            throw new AppException(ErrorCode.CHECK_SHEET_CANNOT_BE_MODIFIED);
        }
        inventoryCheckDetailMapper.update(detail,update);

        // Recalculate difference
        detail.setDifference(update.actualQuantity().subtract(update.systemQuantity()));

        InventoryCheckDetail updatedDetail = inventoryCheckDetailRepo.save(detail);
        return enrich(updatedDetail);
    }

    @Override
    public void deleteInventoryCheckDetail(String id) {
        InventoryCheckDetail detail = getById(id);

        // Only allow deletion if check sheet is still in DRAFT status
        if (detail.getCheckSheet().getStatus() != CheckSheetStatus.DRAFT) {
            throw new AppException(ErrorCode.CHECK_SHEET_CANNOT_BE_MODIFIED);
        }

        inventoryCheckDetailRepo.delete(detail);
    }

    @Override
    public List<InventoryCheckDetail> getDiscrepanciesByCheckSheetId(String checkSheetId) {
        return inventoryCheckDetailRepo.findDiscrepanciesByCheckSheetId(checkSheetId);
    }

    @Override
    public BigDecimal getTotalDiscrepancyByCheckSheetId(String checkSheetId) {
        return inventoryCheckDetailRepo.getTotalDiscrepancyByCheckSheetId(checkSheetId);
    }

    @Override
    public InventoryCheckDetailResponse enrich(InventoryCheckDetail detail) {
        InventoryCheckDetailResponse response = inventoryCheckDetailMapper.toResponse(detail);

        // Enrich with inventory warehouse details
        response.setInventoryWarehouseDetails(
                inventoryWarehouseService.getByIdResponse(detail.getInventoryWarehouseId())
        );

        return response;
    }
}
