package com.example.userservice.Service.Impl;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.WarehouseController;
import com.example.userservice.Dto.Request.LevelRequest;
import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
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
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskServiceImpl implements TaskService {
    TaskMapper taskMapper;
    TaskRepo taskRepo;
    TaskTypeService taskTypeService;
    WarehouseController warehouseController;
    AsyncServiceImpl asyncServiceImpl;

    @Override
    public Page<TaskResponse> getAll(Pageable pageable,String warehouseId) {
        return taskRepo.findAllByIsDeletedAndWarehouses(false,warehouseId, pageable)
                .map(this::entry);
    }

    @Override
    public Page<TaskResponse> getAllByTaskTypeId(Pageable pageable, String taskTypeId,String warehouseId) {
        return taskRepo.findAllByIsDeletedAndTaskType_TaskTypeId(false,taskTypeId, pageable)
                .map(this::entry);
    }

    @Override
    public Tasks getById(String id) {
        return taskRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.TASK_NOT_FOUND));
    }

    @Override
    public TaskResponse getByIdToResponse(String id) {
        Tasks tasks= getById(id);
        return entry(tasks);
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        TaskType taskType=taskTypeService.getByTaskName(request.taskType(), request.warehouses());
        Tasks task=taskMapper.toEntity(request);
        task.setIsDeleted(false);
        task.setTaskType(taskType);
        task.setStatus(StatusTaskEnum.Pending);
        task.setWarehouses(request.warehouses());
        Tasks taskSave=taskRepo.save(task);
        return entry(taskSave);
    }

    @Override
    public TaskResponse updateTask(TaskForm update, String id) {

        Tasks task=getById(id);
        TaskType taskType=taskTypeService.getByTaskName(update.taskType(),task.getWarehouses());
        task.setTaskType(taskType);
        taskMapper.update(task,update);
        Tasks taskSave=taskRepo.save(task);
        return entry(taskSave);
    }

    @Override
    public TaskResponse updateStatus(StatusRequest Status, String id) {
        Tasks task=getById(id);
        task.setStatus(StatusTaskEnum.valueOf(Status.status()));
        Tasks taskSave=taskRepo.save(task);
        return entry(taskSave);
    }

    @Override
    public TaskResponse updateLevel(LevelRequest level, String id) {
        Tasks task=getById(id);
        task.setLevel(LevelEnum.valueOf(level.level()));
        Tasks taskSave=taskRepo.save(task);
        return entry(taskSave);
    }

    @Override
    public TaskResponse updateCompletedStatus(String id) {
        Tasks task=getById(id);
        task.setStatus(StatusTaskEnum.Complete);
        task.setCompleteAt(LocalDateTime.now());
        Tasks taskSave=taskRepo.save(task);
        return entry(taskSave);
    }

    @Override
    public String deleteTask(String id) {
        Tasks task=getById(id);
        task.setDeletedAt(LocalDateTime.now());
        task.setIsDeleted(true);
        taskRepo.save(task);
        return "Deleted Completed";
    }

    @Override
    public TaskResponse entry(Tasks task) {
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl.getWarehouseAsync(task.getWarehouses());
        CompletableFuture.allOf( warehouseFuture).join();
        TaskResponse response = taskMapper.toResponse(task);
        response.setWarehouses(warehouseFuture.join());
        return response;    }

}
