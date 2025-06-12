package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Form.StackForm;
import com.ddd.warehouse.Module.Stacks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service

public interface StackService {
    Page<StackResponse> getAll(Pageable pageable);
    Page<StackResponse> getAllByWarehouseId(Pageable pageable, String warehouseId);
    Boolean exsistByStack(String stackName,String warehouseId);
    StackResponse getByStackNameResponse(String stackName,String warehouseId);
    Stacks getByStackName(String stackName,String warehouseId);
    Stacks getById(String stackId);
    StackResponse getByIdResponse(String stackId);
    StackResponse createStack(StackRequest stackRequest);
    StackResponse updateStack(StackForm update,String stackId);
    String deleteStack(String stackId);
}
