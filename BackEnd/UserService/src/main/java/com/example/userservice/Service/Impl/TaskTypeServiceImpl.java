package com.example.userservice.Service.Impl;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.WarehouseController;
import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Form.TaskTypeForm;
import com.example.userservice.Mapper.TaskTypeMapper;
import com.example.userservice.Model.TaskType;
import com.example.userservice.Repo.TaskTypeRepo;
import com.example.userservice.Service.TaskTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskTypeServiceImpl implements TaskTypeService {
    TaskTypeMapper taskTypeMapper;
    TaskTypeRepo taskTypeRepo;
    WarehouseController warehouseController;
    @Override
    public Page<TaskTypeResponse> getAll(Pageable pageable, String warehouseId) {
        return taskTypeRepo.findAllByIsDeletedAndWarehouses(false, warehouseId, pageable)
                .map(taskType -> {
                    TaskTypeResponse response = taskTypeMapper.toResponse(taskType);
                    WarehousesResponse warehouse = warehouseController
                            .getWarehouse(taskType.getWarehouses())
                            .getResult();
                    return taskTypeMapper.updateWarehouse(response, warehouse);
                });
    }


    @Override
    public TaskType getByTaskName(String taskName,String warehouses) {
        return taskTypeRepo.findByTaskNameAndWarehouses(taskName,warehouses)
                .orElseThrow(()->new AppException(ErrorCode.TASK_TYPE_NOT_FOUND));
    }

    @Override
    public TaskType getByid(String id) {
        return taskTypeRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.TASK_TYPE_NOT_FOUND));
    }

    @Override
    public TaskTypeResponse getByTaskNametoResponse(String taskName,String warehousesId) {
        WarehousesResponse warehouse = null;
        warehouse = warehouseController.getWarehouse(warehousesId).getResult();
        TaskTypeResponse taskTypeResponse=taskTypeMapper.toResponse(getByTaskName(taskName, warehousesId));
        return taskTypeMapper.updateWarehouse(taskTypeResponse,warehouse);
    }

    @Override
    public TaskTypeResponse createTaskType(TaskTypeRequest request) {

        WarehousesResponse warehouse  = warehouseController.getWarehouse(request.warehouses()).getResult();
        log.info("WarehousesResponse:{}",warehouse);
        Optional<TaskType> existing = taskTypeRepo.findByTaskNameAndWarehouses(request.taskName(),request.warehouses());
        if (existing.isPresent()) {
            TaskType taskType = existing.get();
            if (!taskType.getIsDeleted()) {
                throw new AppException(ErrorCode.TASK_TYPE_EXIST);
            }
            taskType.setDescription(request.description());
            taskType.setIsDeleted(false);
            return taskTypeMapper.toResponse(taskTypeRepo.save(taskType));
        }
        TaskType taskType=taskTypeMapper.toEntity(request);
        taskType.setIsDeleted(false);
        taskType.setWarehouses(request.warehouses());
        TaskTypeResponse taskTypeResponse=taskTypeMapper.toResponse(taskTypeRepo.save(taskType));
        return taskTypeMapper.updateWarehouse(taskTypeResponse, warehouse);
    }


    @Override
    public TaskTypeResponse updateTaskType(TaskTypeForm update,String id) {
        WarehousesResponse warehouse = null;
        warehouse = warehouseController.getWarehouse(update.warehouses()).getResult();
        if(taskTypeRepo.existsByTaskName(update.taskName())){
            throw new AppException(ErrorCode.TASK_TYPE_EXIST);
        }
        TaskType taskType=getByid(id);
        taskTypeMapper.update(taskType,update);
        return taskTypeMapper.updateWarehouse(taskTypeMapper.toResponse(taskTypeRepo.save(taskType)), warehouse);
    }

    @Override
    public String deleteByTaskName(String taskName,String warehouses) {
        TaskType taskType=getByTaskName(taskName,warehouses);
        taskType.setDeletedAt(LocalDateTime.now());
        taskType.setIsDeleted(true);
        taskTypeRepo.save(taskType);
        return "Deleted Completed";
    }

}
