package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Client.UserService.Dto.Response.UserResponse;
import com.ddd.warehouse.Client.UserService.Redis.UserController;
import com.ddd.warehouse.Client.UserService.UserClient;
import com.ddd.warehouse.Dto.Request.WarehousesRequest;
import com.ddd.warehouse.Dto.Response.Stack.NearFullStacksResponse;
import com.ddd.warehouse.Dto.Response.Stack.StackCapacityInfo;
import com.ddd.warehouse.Dto.Response.Warehouse.*;
import com.ddd.warehouse.Enum.BinStatus;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.AddressForm;
import com.ddd.warehouse.Form.WarehousesForm;
import com.ddd.warehouse.Mapper.WarehouseMapper;
import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Stacks;
import com.ddd.warehouse.Module.Warehouses;
import com.ddd.warehouse.Repo.BinRepo;
import com.ddd.warehouse.Repo.StackRepo;
import com.ddd.warehouse.Repo.WarehouseRepo;
import com.ddd.warehouse.Service.WarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class WarehouseServiceImpl implements WarehouseService {
    WarehouseMapper warehouseMapper;
    WarehouseRepo warehouseRepo;
    UserController userController;
    private final UserClient userClient;
    private final BinRepo binRepo;
    private final StackRepo stackRepo;

    @Override
    public Page<WarehousesResponse> getAll(Pageable pageable) {
        return warehouseRepo.findAllByIsDeletedFalse( pageable)
                .map(warehouseMapper::toResponse);
    }

    @Override
    public List<WarehousesResponse> getAllList() {
        return warehouseRepo.findAllByIsDeleted(false)
                .stream().map(warehouseMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public WarehousesResponse getByManagerId(String managerId) {
        return warehouseMapper.toResponse(warehouseRepo.findByManagerId(managerId)
                .orElseThrow(()->new AppException(ErrorCode.WAREHOUSE_NOT_FOUND)));
    }

    @Override
    public WarehousesResponse getByStaffId() {
        var idUser=GetCurrentUserId.getCurrentUserId();
        String warehouseId=userClient.getIdWarehouseByIdUser().getResult().getWarehouseId();
        Warehouses warehouse=getById(warehouseId);
        return warehouseMapper.toResponse(warehouse);
    }

    @Override
    public Warehouses getById(String warehouseId) {
        return warehouseRepo.findById(warehouseId)
                .orElseThrow(()->new AppException(ErrorCode.WAREHOUSE_NOT_FOUND));
    }

    @Override
    public Boolean exsistByManagerId(String managerId) {
        return warehouseRepo.existsByManagerId(managerId);
    }

    @Override
    public WarehousesResponse getByIdResponse(String warehouseId) {
        return warehouseMapper.toResponse(getById(warehouseId));
    }

    @Override
    public Page<WarehousesResponse> getByName(String warehouseName, Pageable pageable) {
        return warehouseRepo.findByWarehouseName(warehouseName, pageable).map(warehouseMapper::toResponse);
    }

    @Override
    public WarehousesResponse createWarehouse(WarehousesRequest request) {
        if(exsistByManagerId(request.managerId())){
            throw new AppException(ErrorCode.WAREHOUSE_EXIST);
        }
        Warehouses warehouses=warehouseMapper.toEntity(request);
        warehouses.setIsDeleted(false);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public WarehousesResponse updateWarehouse(String warehouseId, WarehousesForm update) {
        Warehouses warehouses=getById(warehouseId);
        warehouseMapper.update(warehouses,update);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public WarehousesResponse updateAddress(AddressForm addressForm, String warehouseId) {
        Warehouses warehouses=getById(warehouseId);
        warehouseMapper.updateAddress(warehouses,addressForm);
        return warehouseMapper.toResponse(warehouseRepo.save(warehouses));
    }

    @Override
    public String deleteWarehouse(String warehouseId) {
        Warehouses warehouses=getById(warehouseId);
        warehouses.setIsDeleted(true);
        warehouses.setDeletedAt(LocalDateTime.now());
        warehouseRepo.save(warehouses);
        return "Deleted Completed";
    }


    @Override
    public WarehouseCapacityResponse getWarehouseCapacity(String warehouseId) {
        Warehouses warehouse = getById(warehouseId);

        List<Bins> allBins = binRepo.findAllByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);

        Integer totalBins = allBins.size();

        Integer occupiedBins = (int) allBins.stream()
                .filter(bin -> bin.getStatus() == BinStatus.AVAILABLE ||
                        bin.getStatus() == BinStatus.FULL ||
                        bin.getStatus() == BinStatus.MAINTENANCE)
                .count();

        Integer emptyBins = (int) allBins.stream()
                .filter(bin -> bin.getStatus() == BinStatus.EMPTY)
                .count();

        Integer totalCapacity = allBins.stream()
                .mapToInt(Bins::getCapacity)
                .sum();

        // Thêm validation để đảm bảo usedCapacity không vượt quá totalCapacity
        Integer usedCapacity = allBins.stream()
                .mapToInt(bin -> Math.min(bin.getCurrentOccupancy(), bin.getCapacity()))
                .sum();

        Integer utilizationPercentage = totalBins > 0 ?
                Math.round((float) occupiedBins / totalBins * 100) : 0;

        // Đảm bảo percentage không vượt quá 100%
        utilizationPercentage = Math.min(utilizationPercentage, 100);

        return WarehouseCapacityResponse.builder()
                .warehouseId(warehouse.getWarehouseId())
                .warehouseName(warehouse.getWarehouseName())
                .totalBins(totalBins)
                .occupiedBins(occupiedBins)
                .availableBins(emptyBins)
                .utilizationPercentage(utilizationPercentage)
                .totalCapacity(totalCapacity)
                .usedCapacity(usedCapacity)
                .build();
    }

    @Override
    public WarehouseInventoryCheck getWarehouseInventoryCheck(String warehouseId) {
        Warehouses warehouse = getById(warehouseId);

        List<Bins> allBins = binRepo.findAllByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);
        Integer occupiedBins = (int) allBins.stream()
                .filter(bin -> bin.getStatus() == BinStatus.AVAILABLE ||
                        bin.getStatus() == BinStatus.FULL ||
                        bin.getStatus() == BinStatus.MAINTENANCE)
                .count();

        Integer emptyBins = (int) allBins.stream()
                .filter(bin -> bin.getStatus() == BinStatus.EMPTY)
                .count();
        Integer totalBins = allBins.size();

        return null;
    }

    @Override
    public NearFullStacksResponse getNearFullStacks(String warehouseId, Integer threshold) {
        Warehouses warehouse = getById(warehouseId);

        // Lấy tất cả stacks của warehouse
        List<Stacks> allStacks = stackRepo.findByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);

        List<StackCapacityInfo> nearFullStacks = new ArrayList<>();

        for (Stacks stack : allStacks) {
            // Lấy tất cả bins của stack
            List<Bins> stackBins = binRepo.findByStack_StackIdAndIsDeleted(stack.getStackId(), false);

            Integer totalBins = stackBins.size();
            if (totalBins == 0) continue;

            // Sử dụng status để xác định bin đã sử dụng (theo logic mới)
            Integer occupiedBins = (int) stackBins.stream()
                    .filter(bin -> bin.getStatus() == BinStatus.AVAILABLE ||
                            bin.getStatus() == BinStatus.FULL ||
                            bin.getStatus() == BinStatus.MAINTENANCE)
                    .count();

            Integer emptyBins = totalBins - occupiedBins;
            Double utilizationPercentage = (double) occupiedBins / totalBins * 100;

            // Kiểm tra nếu stack gần đầy
            if (utilizationPercentage >= threshold) {
                String status = utilizationPercentage >= 95 ? "critical" :
                        utilizationPercentage >= threshold ? "warning" : "normal";

                StackCapacityInfo stackInfo = StackCapacityInfo.builder()
                        .stackId(stack.getStackId())
                        .stackName(stack.getStackName())
                        .totalBins(totalBins)
                        .occupiedBins(occupiedBins)
                        .emptyBins(emptyBins)
                        .utilizationPercentage(Math.round(utilizationPercentage * 100.0) / 100.0)
                        .status(status)
                        .build();

                nearFullStacks.add(stackInfo);
            }
        }

        // Sắp xếp theo mức độ sử dụng giảm dần
        nearFullStacks.sort((a, b) -> Double.compare(b.getUtilizationPercentage(), a.getUtilizationPercentage()));

        Double nearFullPercentage = allStacks.size() > 0 ?
                (double) nearFullStacks.size() / allStacks.size() * 100 : 0.0;

        return NearFullStacksResponse.builder()
                .warehouseId(warehouse.getWarehouseId())
                .warehouseName(warehouse.getWarehouseName())
                .totalStacks(allStacks.size())
                .nearFullStacksCount(nearFullStacks.size())
                .nearFullPercentage(Math.round(nearFullPercentage * 100.0) / 100.0)
                .nearFullStacks(nearFullStacks)
                .build();
    }

    @Override
    public WarehouseCapacityStatsResponse getCapacityStats(String warehouseId, String timeFilter) {
        List<Stacks> allStacks = stackRepo.findByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);

        Integer totalBins = 0;
        Integer emptyBins = 0;
        Integer occupiedBins = 0;
        Integer criticalStacks = 0;

        for (Stacks stack : allStacks) {
            List<Bins> stackBins = binRepo.findByStack_StackIdAndIsDeleted(stack.getStackId(), false);

            totalBins += stackBins.size();

            // Sử dụng status thay vì currentOccupancy như đã thảo luận
            Integer stackEmptyBins = (int) stackBins.stream()
                    .filter(bin -> bin.getStatus() == BinStatus.EMPTY)
                    .count();

            Integer stackOccupiedBins = stackBins.size() - stackEmptyBins;

            emptyBins += stackEmptyBins;
            occupiedBins += stackOccupiedBins;

            // Tính stack gần đầy (>90% sử dụng)
            if (stackBins.size() > 0) {
                double utilizationRate = (double) stackOccupiedBins / stackBins.size() * 100;
                if (utilizationRate > 90) {
                    criticalStacks++;
                }
            }
        }

        Integer utilizationPercentage = totalBins > 0 ?
                Math.round((float) occupiedBins / totalBins * 100) : 0;

        return WarehouseCapacityStatsResponse.builder()
                .totalBins(totalBins)
                .emptyBins(emptyBins)
                .occupiedBins(occupiedBins)
                .utilizationPercentage(utilizationPercentage)
                .criticalStacks(criticalStacks)
                .build();
    }

    @Override
    public List<StorageAlertResponse> getStorageAlerts(String warehouseId) {
        List<Stacks> allStacks = stackRepo.findByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);
        List<StorageAlertResponse> alerts = new ArrayList<>();

        for (Stacks stack : allStacks) {
            List<Bins> stackBins = binRepo.findByStack_StackIdAndIsDeleted(stack.getStackId(), false);

            if (stackBins.isEmpty()) continue;

            // Tính utilization dựa trên status
            Integer totalBins = stackBins.size();
            Integer occupiedBins = (int) stackBins.stream()
                    .filter(bin -> bin.getStatus() == BinStatus.AVAILABLE ||
                            bin.getStatus() == BinStatus.FULL ||
                            bin.getStatus() == BinStatus.MAINTENANCE)
                    .count();

            Double utilizationPercentage = (double) occupiedBins / totalBins * 100;

            // Tạo alert nếu stack gần đầy
            if (utilizationPercentage > 90) {
                alerts.add(StorageAlertResponse.builder()
                        .type("critical")
                        .title("Stack Gần Đầy")
                        .message(String.format("%s đã sử dụng %.0f%%",
                                stack.getStackName(), utilizationPercentage))
                        .stackId(stack.getStackId())
                        .stackName(stack.getStackName())
                        .utilizationPercentage(utilizationPercentage)
                        .severity("HIGH")
                        .createdAt(LocalDateTime.now())
                        .build());
            } else if (utilizationPercentage > 70) {
                alerts.add(StorageAlertResponse.builder()
                        .type("warning")
                        .title("Cảnh Báo Sức Chứa")
                        .message(String.format("%s đã sử dụng %.0f%%",
                                stack.getStackName(), utilizationPercentage))
                        .stackId(stack.getStackId())
                        .stackName(stack.getStackName())
                        .utilizationPercentage(utilizationPercentage)
                        .severity("MEDIUM")
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }

        // Sắp xếp theo mức độ nghiêm trọng
        alerts.sort((a, b) -> Double.compare(b.getUtilizationPercentage(), a.getUtilizationPercentage()));

        return alerts;
    }

    @Override
    public List<StackCapacityDetailResponse> getStackCapacityDetails(String warehouseId) {
        List<Stacks> allStacks = stackRepo.findByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false);
        List<StackCapacityDetailResponse> stackDetails = new ArrayList<>();

        for (Stacks stack : allStacks) {
            List<Bins> stackBins = binRepo.findByStack_StackIdAndIsDeleted(stack.getStackId(), false);

            Integer totalBins = stackBins.size();
            Integer emptyBins = (int) stackBins.stream()
                    .filter(bin -> bin.getStatus() == BinStatus.EMPTY)
                    .count();
            Integer occupiedBins = totalBins - emptyBins;
            Integer maintenanceBins = (int) stackBins.stream()
                    .filter(bin -> bin.getStatus() == BinStatus.MAINTENANCE)
                    .count();

            Double utilizationPercentage = totalBins > 0 ?
                    (double) occupiedBins / totalBins * 100 : 0.0;

            String status = utilizationPercentage > 90 ? "critical" :
                    utilizationPercentage > 70 ? "warning" : "normal";

            stackDetails.add(StackCapacityDetailResponse.builder()
                    .stackId(stack.getStackId())
                    .stackName(stack.getStackName())
                    .description(stack.getDescription())
                    .totalBins(totalBins)
                    .emptyBins(emptyBins)
                    .occupiedBins(occupiedBins)
                    .maintenanceBins(maintenanceBins)
                    .utilizationPercentage(Math.round(utilizationPercentage * 100.0) / 100.0)
                    .status(status)
                    .createdAt(stack.getCreatedAt())
                    .updatedAt(stack.getUpdatedAt())
                    .build());
        }

        // Sắp xếp theo utilization giảm dần
        stackDetails.sort((a, b) -> Double.compare(b.getUtilizationPercentage(), a.getUtilizationPercentage()));

        return stackDetails;
    }

}
