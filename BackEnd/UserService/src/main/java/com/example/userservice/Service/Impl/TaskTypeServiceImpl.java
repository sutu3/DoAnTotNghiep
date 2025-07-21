package com.example.userservice.Service.Impl;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
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
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskTypeServiceImpl implements TaskTypeService {
    TaskTypeMapper taskTypeMapper;
    TaskTypeRepo taskTypeRepo;
    WarehouseController warehouseController;
    private final AsyncServiceImpl asyncServiceImpl;

    @Override
    public Page<TaskTypeResponse> getAll(Pageable pageable, String warehouseId) {
        return taskTypeRepo.findAllByIsDeletedAndWarehouses(false, warehouseId, pageable)
                .map(this::entry);
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
        TaskType taskType=getByTaskName(taskName, warehousesId);
        return entry(taskType);
    }

    @Override
    public TaskTypeResponse createTaskType(TaskTypeRequest request) {
        Optional<TaskType> existing = taskTypeRepo.findByTaskNameAndWarehouses(request.taskName(),request.warehouses());
        if (existing.isPresent()) {
            TaskType taskType = existing.get();
            if (!taskType.getIsDeleted()) {
                throw new AppException(ErrorCode.TASK_TYPE_EXIST);
            }
            taskType.setDescription(request.description());
            taskType.setIsDeleted(false);
            TaskType taskTypeSave = taskTypeRepo.save(taskType);
            return entry(taskTypeSave);
        }
        TaskType taskType=taskTypeMapper.toEntity(request);
        taskType.setIsDeleted(false);
        taskType.setWarehouses(request.warehouses());
        TaskType taskTypeSave = taskTypeRepo.save(taskType);
        return entry(taskTypeSave);
    }


    @Override
    public TaskTypeResponse updateTaskType(TaskTypeForm update,String id) {
        if(taskTypeRepo.existsByTaskName(update.taskName())){
            throw new AppException(ErrorCode.TASK_TYPE_EXIST);
        }
        TaskType taskType=getByid(id);
        taskTypeMapper.update(taskType,update);
        TaskType taskTypeSave = taskTypeRepo.save(taskType);
        return entry(taskTypeSave);
    }

    @Override
    public String deleteByTaskName(String taskName,String warehouses) {
        TaskType taskType=getByTaskName(taskName,warehouses);
        taskType.setDeletedAt(LocalDateTime.now());
        taskType.setIsDeleted(true);
        taskTypeRepo.save(taskType);
        return "Deleted Completed";
    }

    @Override
    public TaskTypeResponse entry(TaskType taskType) {
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl.getWarehouseAsync(taskType.getWarehouses());
        CompletableFuture.allOf( warehouseFuture).join();
        TaskTypeResponse response = taskTypeMapper.toResponse(taskType);
        response.setWarehouses(warehouseFuture.join());
        return response;
    }

}
