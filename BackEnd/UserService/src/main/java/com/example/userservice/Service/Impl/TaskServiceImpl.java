package com.example.userservice.Service.Impl;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.WarehouseController;
import com.example.userservice.Dto.Request.LevelRequest;
import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Form.TaskForm;
import com.example.userservice.Mapper.TaskMapper;
import com.example.userservice.Model.TaskType;
import com.example.userservice.Model.Tasks;
import com.example.userservice.Repo.TaskRepo;
import com.example.userservice.Service.TaskService;
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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskServiceImpl implements TaskService {
    TaskMapper taskMapper;
    TaskRepo taskRepo;
    TaskTypeService taskTypeService;
    WarehouseController warehouseController;
    @Override
    public Page<TaskResponse> getAll(Pageable pageable,String warehouseId) {
        return taskRepo.findAllByIsDeletedAndWarehouses(false,warehouseId, pageable)
                .map(task->{
                    TaskResponse taskResponse=taskMapper.toResponse(task);
                    WarehousesResponse warehouse = warehouseController
                            .getWarehouse(warehouseId)
                            .getResult();
                    return taskMapper.updateWarehouse(taskResponse,warehouse);
                });
    }

    @Override
    public Page<TaskResponse> getAllByTaskTypeId(Pageable pageable, String taskTypeId,String warehouseId) {
        return taskRepo.findAllByIsDeletedAndTaskType_TaskTypeId(false,taskTypeId, pageable)
                .map(task->{
                    TaskResponse taskResponse=taskMapper.toResponse(task);
                    WarehousesResponse warehouse = warehouseController
                            .getWarehouse(warehouseId)
                            .getResult();
                    return taskMapper.updateWarehouse(taskResponse,warehouse);
                });
    }

    @Override
    public Tasks getById(String id) {
        return taskRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.TASK_NOT_FOUND));
    }

    @Override
    public TaskResponse getByIdToResponse(String id) {
        Tasks tasks= getById(id);
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(tasks.getWarehouses()).getResult();
        return taskMapper.updateWarehouse(taskMapper.toResponse(tasks),warehouse);
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(request.warehouses()).getResult();
        TaskType taskType=taskTypeService.getByTaskName(request.taskType(), request.warehouses());
        Tasks task=taskMapper.toEntity(request);
        task.setIsDeleted(false);
        task.setTaskType(taskType);
        task.setStatus(StatusTaskEnum.Pending);
        task.setWarehouses(request.warehouses());
        taskRepo.save(task);
        return taskMapper.updateWarehouse(taskMapper.toResponse(task),warehouse);
    }

    @Override
    public TaskResponse updateTask(TaskForm update, String id) {

        Tasks task=getById(id);
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(task.getWarehouses()).getResult();
        TaskType taskType=taskTypeService.getByTaskName(update.taskType(),task.getWarehouses());
        task.setTaskType(taskType);
        taskMapper.update(task,update);
        return taskMapper.updateWarehouse(taskMapper.toResponse(task),warehouse);
    }

    @Override
    public TaskResponse updateStatus(StatusRequest Status, String id) {
        Tasks task=getById(id);
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(task.getWarehouses()).getResult();
        task.setStatus(StatusTaskEnum.valueOf(Status.status()));
        return taskMapper.updateWarehouse(taskMapper.toResponse(task),warehouse);
    }

    @Override
    public TaskResponse updateLevel(LevelRequest level, String id) {
        Tasks task=getById(id);
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(task.getWarehouses()).getResult();
        task.setLevel(LevelEnum.valueOf(level.level()));
        return taskMapper.updateWarehouse(taskMapper.toResponse(task),warehouse);
    }

    @Override
    public TaskResponse updateCompletedStatus(String id) {
        Tasks task=getById(id);
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(task.getWarehouses()).getResult();
        task.setStatus(StatusTaskEnum.Complete);
        task.setCompleteAt(LocalDateTime.now());
        return taskMapper.updateWarehouse(taskMapper.toResponse(task),warehouse);
    }

    @Override
    public String deleteTask(String id) {
        Tasks task=getById(id);
        task.setDeletedAt(LocalDateTime.now());
        task.setIsDeleted(true);
        taskRepo.save(task);
        return "Deleted Completed";
    }

}
