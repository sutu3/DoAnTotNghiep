package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.StackForm;
import com.ddd.warehouse.Mapper.StackMapper;
import com.ddd.warehouse.Module.Stacks;
import com.ddd.warehouse.Module.Warehouses;
import com.ddd.warehouse.Repo.StackRepo;
import com.ddd.warehouse.Service.StackService;
import com.ddd.warehouse.Service.WarehouseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class StackServiceImpl implements StackService {
    private final StackMapper stackMapper;
    private final StackRepo stackRepo;
    private final WarehouseService warehouseService;

    @Override
    public Page<StackResponse> getAll(Pageable pageable) {
        return stackRepo.findAllByIsDeleted(pageable, false).map(stackMapper::toResponse);
    }

    @Override
    public Page<StackResponse> getAllByWarehouseId(Pageable pageable, String warehouseId) {
        return stackRepo.findAllByWarehouseId(pageable, warehouseId).map(stackMapper::toResponse);
    }

    @Override
    public StackResponse getByStackNameResponse(String stackName) {
        return stackMapper.toResponse(getByStackName(stackName));
    }

    @Override
    public Stacks getByStackName(String stackName) {
        return stackRepo.findByStackName(stackName)
                .orElseThrow(() -> new AppException(ErrorCode.STACK_NOT_FOUND));
    }

    @Override
    public Stacks getById(String stackId) {
        return stackRepo.findById(stackId).orElseThrow(() -> new AppException(ErrorCode.STACK_NOT_FOUND));
    }

    @Override
    public StackResponse getByIdResponse(String stackId) {
        return getByIdResponse(stackId);
    }

    @Override
    public StackResponse createStack(StackRequest stackRequest) {
        Warehouses warehouses=warehouseService.getById(stackRequest.warehouse());
        Optional<Stacks> existing= Optional.ofNullable(getByStackName(stackRequest.stackName()));
        if(existing.isPresent()){
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
        return stackMapper.toResponse(stackRepo.save(stacks));
    }

    @Override
    public StackResponse updateStack(StackForm update,String stackId) {
        Stacks stacks=getById(stackId);
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
