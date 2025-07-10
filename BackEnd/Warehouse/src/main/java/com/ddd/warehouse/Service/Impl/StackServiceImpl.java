package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.StackForm;
import com.ddd.warehouse.Mapper.StackMapper;
import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Stacks;
import com.ddd.warehouse.Module.Warehouses;
import com.ddd.warehouse.Repo.StackRepo;
import com.ddd.warehouse.Service.BinService;
import com.ddd.warehouse.Service.StackService;
import com.ddd.warehouse.Service.WarehouseService;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class StackServiceImpl implements StackService {
    StackMapper stackMapper;
    StackRepo stackRepo;
    WarehouseService warehouseService;

    @Override
    public Page<StackResponse> getAll(Pageable pageable) {
        return stackRepo.findAllByIsDeleted(pageable, false).map(stackMapper::toResponse);
    }

    @Override
    public Page<StackResponse> getAllByWarehouseId(Pageable pageable, String warehouseId) {
        return stackRepo.findAllByWarehouse_WarehouseId(pageable, warehouseId).map(stackMapper::toResponse);
    }

    @Override
    public List<StackResponse> getAllListByWarehouseId(String warehouseId) {
        return stackRepo.findAllByWarehouse_WarehouseId( warehouseId)
                .stream().map(stackMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Boolean exsistByStack(String stackName,String warehouseId) {
        return stackRepo.existsByStackNameAndWarehouse_WarehouseId(stackName,warehouseId);
    }
    @Override
    public StackResponse getByStackNameResponse(String stackName,String warehouseId) {
        return stackMapper.toResponse(getByStackName(stackName,warehouseId));
    }
    @Override
    public Stacks getByStackName(String stackName,String warehouseId) {
        return stackRepo.findByStackNameAndWarehouse_WarehouseId(stackName,warehouseId)
                .orElseThrow(() -> new AppException(ErrorCode.STACK_NOT_FOUND));
    }
    @Override
    public Stacks getById(String stackId) {
        return stackRepo.findById(stackId).orElseThrow(() -> new AppException(ErrorCode.STACK_NOT_FOUND));
    }
    @Override
    public StackResponse getByIdResponse(String stackId) {
        return stackMapper.toResponse(getById(stackId));
    }
    @Override
    public StackResponse createStack(StackRequest stackRequest) {
        Warehouses warehouses=warehouseService.getById(stackRequest.warehouse());
        if(exsistByStack(stackRequest.warehouse(),stackRequest.warehouse())){
            Optional<Stacks> existing= Optional.ofNullable(getByStackName(stackRequest.stackName(),stackRequest.warehouse()));
            Stacks stack=existing.get();
            if(stack.getIsDeleted()){
                throw new AppException(ErrorCode.STACK_EXIST);
            }
            stack.setIsDeleted(false);
            stack.setDescription(stackRequest.description());
            return stackMapper.toResponse(stackRepo.save(stack));
        }
        Stacks stacks=stackMapper.toEntity(stackRequest);
        stacks.setWarehouse(warehouses);
        stacks.setIsDeleted(false);
        Stacks stackCreated=stackRepo.save(stacks);
        return stackMapper.toResponse(stackCreated);
    }
    @Override
    public StackResponse updateStack(StackForm update,String stackId) {
        Stacks stacks=getById(stackId);
        if(exsistByStack(update.stackName(),stacks.getWarehouse().getWarehouseId())){
            throw new AppException(ErrorCode.STACK_EXIST);
        }
        stackMapper.update(stacks,update);
        return stackMapper.toResponse(stackRepo.save(stacks));
    }
    @Override
    public String deleteStack(String stackId) {
        Stacks stack=getById(stackId);
        stack.setIsDeleted(true);
        stack.setDeletedAt(LocalDateTime.now());
        stackRepo.save(stack);
        return "Deleted Completed";
    }
}
