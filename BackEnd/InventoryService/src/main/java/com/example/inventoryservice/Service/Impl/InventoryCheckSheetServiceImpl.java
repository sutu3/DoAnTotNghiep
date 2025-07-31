package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.UserService.Dto.Response.UserResponse;
import com.example.inventoryservice.Client.UserService.Redis.UserController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Dtos.Request.InventoryCheckDetailRequest;
import com.example.inventoryservice.Dtos.Request.InventoryCheckSheetRequest;
import com.example.inventoryservice.Dtos.Request.StockMovementRequest;
import com.example.inventoryservice.Dtos.Response.InventoryCheckDetailResponse;
import com.example.inventoryservice.Dtos.Response.InventoryCheckSheetResponse;
import com.example.inventoryservice.Enum.CheckSheetStatus;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Form.InventoryCheckSheetForm;
import com.example.inventoryservice.Mapper.InventoryCheckDetailMapper;
import com.example.inventoryservice.Mapper.InventoryCheckSheetMapper;
import com.example.inventoryservice.Module.InventoryCheckDetail;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import com.example.inventoryservice.Module.InventoryWarehouse;
import com.example.inventoryservice.Repo.InventoryCheckSheetRepo;
import com.example.inventoryservice.Service.InventoryCheckDetailService;
import com.example.inventoryservice.Service.InventoryCheckSheetService;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import com.example.inventoryservice.Service.StockMovementService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryCheckSheetServiceImpl implements InventoryCheckSheetService {

    InventoryCheckSheetRepo inventoryCheckSheetRepo;
    InventoryCheckSheetMapper inventoryCheckSheetMapper;
    InventoryCheckDetailService inventoryCheckDetailService;
    InventoryWarehouseService inventoryWarehouseService;
    StockMovementService stockMovementService;
    UserController userController;
    WarehouseController warehouseController;
    AsyncServiceImpl asyncServiceImpl;

    @Override
    public Page<InventoryCheckSheetResponse> getAllByWarehouse(Pageable pageable, String warehouseId) {
        return inventoryCheckSheetRepo.findAllByWarehouseAndIsDeleted(warehouseId, false, pageable)
                .map(this::enrich);
    }

    @Override
    public List<InventoryCheckSheetResponse> getAllByPerformedBy(String performedBy) {
        return inventoryCheckSheetRepo.findAllByPerformedByAndIsDeleted(performedBy, false)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryCheckSheet getById(String id) {
        return inventoryCheckSheetRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_CHECK_SHEET_NOT_FOUND));
    }

    @Override
    public InventoryCheckSheetResponse getByIdResponse(String id) {
        return enrich(getById(id));
    }

    @Override
    @Transactional
    public InventoryCheckSheetResponse createInventoryCheckSheet(InventoryCheckSheetRequest request) {
        var userId=GetCurrentUserId.getCurrentUserId();
        // Validate warehouse and user
        warehouseController.getWarehouse(request.getWarehouse());
        userController.getUser(userId);

        // Check if check sheet number already exists
        if (inventoryCheckSheetRepo.findByCheckSheetNumberAndIsDeleted(request.getCheckSheetNumber(), false).isPresent()) {
            throw new AppException(ErrorCode.CHECK_SHEET_NUMBER_EXISTS);
        }

        // Create check sheet
        InventoryCheckSheet checkSheet = inventoryCheckSheetMapper.toEntity(request);
        checkSheet.setIsDeleted(false);
        checkSheet.setStatus(CheckSheetStatus.DRAFT);

        InventoryCheckSheet savedCheckSheet = inventoryCheckSheetRepo.save(checkSheet);

        // Create check details if provided
        if (request.getCheckDate() != null && !request.getCheckDetails().isEmpty()) {
            for (InventoryCheckDetailRequest detailRequest : request.getCheckDetails()) {
                inventoryCheckDetailService.createInventoryCheckDetail(detailRequest, savedCheckSheet.getCheckSheetId());
            }
        }

        return enrich(savedCheckSheet);
    }

    @Override
    public InventoryCheckSheetResponse updateInventoryCheckSheet(InventoryCheckSheetForm form, String id) {
        InventoryCheckSheet checkSheet = getById(id);

        // Only allow updates if status is DRAFT
        if (checkSheet.getStatus() != CheckSheetStatus.DRAFT) {
            throw new AppException(ErrorCode.CHECK_SHEET_CANNOT_BE_MODIFIED);
        }

        inventoryCheckSheetMapper.update(checkSheet, form);
        checkSheet.setUpdatedAt(LocalDateTime.now());

        InventoryCheckSheet updatedCheckSheet = inventoryCheckSheetRepo.save(checkSheet);
        return enrich(updatedCheckSheet);
    }

    @Override
    public void deleteInventoryCheckSheet(String id) {
        InventoryCheckSheet checkSheet = getById(id);

        // Only allow deletion if status is DRAFT
        if (checkSheet.getStatus() != CheckSheetStatus.DRAFT) {
            throw new AppException(ErrorCode.CHECK_SHEET_CANNOT_BE_DELETED);
        }

        checkSheet.setIsDeleted(true);
        checkSheet.setDeletedAt(LocalDateTime.now());
        inventoryCheckSheetRepo.save(checkSheet);
    }

    @Override
    public List<InventoryCheckSheetResponse> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return inventoryCheckSheetRepo.findByCheckDateBetween(startDate, endDate)
                .stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InventoryCheckSheetResponse processCheckSheet(String id) {
        InventoryCheckSheet checkSheet = getById(id);

        if (checkSheet.getStatus() != CheckSheetStatus.DRAFT) {
            throw new AppException(ErrorCode.CHECK_SHEET_ALREADY_PROCESSED);
        }

        // Get all check details with discrepancies
        List<InventoryCheckDetail> discrepancies = inventoryCheckDetailService.getDiscrepanciesByCheckSheetId(id);

        // Create stock movements for each discrepancy
        for (InventoryCheckDetail detail : discrepancies) {
            if (detail.getDifference().compareTo(BigDecimal.ZERO) != 0) {
                StockMovementRequest stockMovementRequest = StockMovementRequest.builder()
                        .inventoryWarehouseId(detail.getInventoryWarehouseId())
                        .product(getProductIdFromInventoryWarehouse(detail.getInventoryWarehouseId()))
                        .quantity(detail.getActualQuantity())
                        .movementType("ADJUSTMENT")
                        .note(STR."Inventory check adjustment - Check Sheet: \{checkSheet.getCheckSheetNumber()} - Reason: \{detail.getAdjustmentReason()}")
                        .performedBy(checkSheet.getPerformedBy())
                        .checkSheetId(id)
                        .unitCost(BigDecimal.ZERO)
                        .build();

                stockMovementService.createStockMovement(stockMovementRequest);
            }
        }

        // Update check sheet status
        checkSheet.setStatus(CheckSheetStatus.COMPLETED);
        checkSheet.setUpdatedAt(LocalDateTime.now());

        InventoryCheckSheet processedCheckSheet = inventoryCheckSheetRepo.save(checkSheet);
        return enrich(processedCheckSheet);
    }

    @Override
    public InventoryCheckSheetResponse enrich(InventoryCheckSheet checkSheet) {
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(checkSheet.getPerformedBy());
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl
                .getWarehouseAsync(checkSheet.getWarehouse());

        CompletableFuture.allOf(userFuture, warehouseFuture).join();

        InventoryCheckSheetResponse response = inventoryCheckSheetMapper.toResponse(checkSheet);
        response.setPerformedByDetails(userFuture.join());
        response.setWarehouseDetails(warehouseFuture.join());

        // Enrich check details
        if (checkSheet.getCheckDetails() != null) {
            List<InventoryCheckDetailResponse> enrichedDetails = checkSheet.getCheckDetails()
                    .stream()
                    .map(inventoryCheckDetailService::enrich)
                    .collect(Collectors.toList());
            response.setCheckDetails(enrichedDetails);
        }

        return response;
    }

    private String getProductIdFromInventoryWarehouse(String inventoryWarehouseId) {
        InventoryWarehouse inventoryWarehouse = inventoryWarehouseService.getById(inventoryWarehouseId);
        return inventoryWarehouse.getProduct();
    }
}