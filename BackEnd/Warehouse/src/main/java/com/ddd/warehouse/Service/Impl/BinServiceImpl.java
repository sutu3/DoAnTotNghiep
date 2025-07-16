package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponseNoWarehouse;
import com.ddd.warehouse.Enum.BinStatus;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.BinForm;
import com.ddd.warehouse.Mapper.BinMapper;
import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Stacks;
import com.ddd.warehouse.Module.Warehouses;
import com.ddd.warehouse.Repo.BinRepo;
import com.ddd.warehouse.Repo.WarehouseRepo;
import com.ddd.warehouse.Service.BinService;
import com.ddd.warehouse.Service.StackService;
import com.ddd.warehouse.Utils.CheckNumber;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.ddd.warehouse.Utils.CheckNumber.IsLessThanOrEqualZero;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class BinServiceImpl implements BinService {
     BinMapper binMapper;
     BinRepo binRepo;
    @Lazy
    StackService stackService;
     WarehouseRepo warehouseRepo;
    @Override
    public Page<BinResponse> getAll(Pageable pageable) {
        return binRepo.findAllByIsDeleted(pageable,false).map(binMapper::toResponse);
    }

    @Override
    public Page<BinResponse> getAllByWarehouseId(Pageable pageable, String warehouseId) {
        return binRepo.findAllByWarehouse_WarehouseId(pageable,warehouseId).map(binMapper::toResponse);
    }
    @Override
    public List<BinResponse> getAllListByWarehouseId( String warehouseId) {
        return binRepo.findAllByWarehouse_WarehouseIdAndIsDeleted(warehouseId, false).stream()
                .map(binMapper::toResponse).collect(Collectors.toList());
    }
    @Override
    public Page<BinResponse> getAllByStackName(Pageable pageable, String stackName) {
        return binRepo.findAllByStack_StackName(pageable,stackName).map(binMapper::toResponse);
    }

    @Override
    public BinResponse getByBinCodeResponse(String BinName,String stackName,String warehouseId) {
        String binCode=stackName+"-"+BinName;
        return binMapper.toResponse(getByBinCode(binCode,stackName,warehouseId));
    }

    @Override
    public Bins getByBinCode(String BinName,String stackName,String warehouseId) {
        return binRepo.findByBinCodeAndStack_StackNameAndWarehouse_WarehouseId(BinName,stackName,warehouseId)
                .orElseThrow(()->new AppException(ErrorCode.STACK_NOT_FOUND));
    }

    @Override
    public Boolean exsistByBinCode(String BinName, String stackName, String warehouseId) {
        return binRepo.existsByBinCodeAndStack_StackNameAndWarehouse_WarehouseId(BinName,stackName,warehouseId);
    }

    @Override
    public void updateCurrentOccupancy(String binId, Integer occupancyChange) {
        Bins bin = getById(binId);

        // Tính toán occupancy mới
//        Integer newOccupancy = bin.getCurrentOccupancy() + occupancyChange;
//
//        // Validate không vượt quá capacity
//        if (newOccupancy > bin.getCapacity()) {
//            throw new AppException(ErrorCode.BIN_CAPACITY_EXCEEDED);
//        }
//        // Validate không âm
//        if (newOccupancy < 0) {
//            throw new AppException(ErrorCode.INVALID_OCCUPANCY);
//        }

        bin.setCurrentOccupancy(0);
        bin.setStatus(BinStatus.AVAILABLE);

//        // Cập nhật status dựa trên occupancy
//        if (newOccupancy == 0) {
//            bin.setStatus(BinStatus.EMPTY);
//        } else if (newOccupancy >= bin.getCapacity()) {
//            bin.setStatus(BinStatus.FULL);
//        } else {
//            bin.setStatus(BinStatus.AVAILABLE);
//        }

        binRepo.save(bin);
    }
    @Override
    public void resetCurrentOccupancy(String binId) {
        Bins bin = getById(binId);
        bin.setCurrentOccupancy(0);
        bin.setStatus(BinStatus.EMPTY);
        binRepo.save(bin);
    }

    @Override
    public Bins getById(String BinId) {
        return binRepo.findById(BinId)
                .orElseThrow(()->new AppException(ErrorCode.BIN_NOT_FOUND));
    }

    @Override
    public BinResponse getByIdResponse(String BinId) {
        return binMapper.toResponse(getById(BinId));
    }

    @Override
    public BinResponseNoWarehouse createBin(BinRequest BinRequest) {
        if(IsLessThanOrEqualZero(BinRequest.capacity())){
            throw new AppException(ErrorCode.CAPICITY_INVALID);
        }
        Stacks stack = stackService.getById(BinRequest.stack());
        String binCode = BinRequest.binCode();
        Warehouses warehouses=warehouseRepo.getById(BinRequest.warehouse());
//        if (exsistByBinCode(BinRequest.binCode(), BinRequest.stack(), BinRequest.warehouse())) {
//            Optional<Bins> exsisting= Optional.ofNullable(
//                    getByBinCode(binCode,stack.getStackName(),warehouses.getWarehouseId()));
//            Bins bin=exsisting.get();
//            if(bin.getIsDeleted()){
//                bin.setCapacity(bin.getCapacity());
//                bin.setIsDeleted(false);
//                return binMapper.toResponse(binRepo.save(bin));
//            }
//        }
        Bins bin= binMapper.toEntity(BinRequest);
        bin.setStatus(BinStatus.EMPTY);
        bin.setBinCode(binCode);
        bin.setStack(stack);
        bin.setCurrentOccupancy(0);
        bin.setWarehouse(warehouses);
        bin.setIsDeleted(false);
        return binMapper.toDto(binRepo.save(bin));
    }

    @Override
    public BinResponse updateBin(BinForm update, String BinId) {
        Bins bin=getById(BinId);
        String binCode=bin.getStack().getStackName()+"-"+update.binCode();
        if(IsLessThanOrEqualZero(update.capacity())){
            throw new AppException(ErrorCode.CAPICITY_INVALID);
        }
        if(exsistByBinCode(binCode, bin.getStack().getStackName(),bin.getWarehouse().getWarehouseId())) {
            throw new AppException(ErrorCode.BIN_EXIST);
        }
        binMapper.update(bin,update);
        bin.setBinCode(binCode);
        return binMapper.toResponse(binRepo.save(bin));
    }

    @Override
    public String deleteBin(String BinId) {
        Bins bin=getById(BinId);
        bin.setIsDeleted(true);
        bin.setDeletedAt(LocalDateTime.now());
        binRepo.save(bin);
        return "Deleted Completed";
    }
}
