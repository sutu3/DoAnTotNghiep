package com.example.userservice.Service.Impl;

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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskServiceImpl implements TaskService {
    TaskMapper taskMapper;
    TaskRepo taskRepo;
    TaskTypeService taskTypeService;

    @Override
    public Page<TaskResponse> getAll(Pageable pageable) {
        return taskRepo.findAllByIsDeleted(false, pageable).map(taskMapper::toResponse);
    }

    @Override
    public Tasks getById(String id) {
        return taskRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.TASK_NOT_FOUND));
    }

    @Override
    public TaskResponse getByIdToResponse(String id) {
        return taskMapper.toResponse(getById(id));
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        TaskType taskType=taskTypeService.getByTaskName(request.taskType());
        Tasks task=taskMapper.toEntity(request);
        task.setIsDeleted(false);
        task.setTaskType(taskType);
        task.setStatus(StatusTaskEnum.Pending);
        return taskMapper.toResponse(taskRepo.save(task));
    }

    @Override
    public TaskResponse updateTask(TaskForm update, String id) {
        Tasks tasks=getById(id);
        TaskType taskType=taskTypeService.getByTaskName(update.taskType());
        tasks.setTaskType(taskType);
        taskMapper.update(tasks,update);
        return taskMapper.toResponse(taskRepo.save(tasks));
    }

    @Override
    public TaskResponse updateStatus(StatusRequest Status, String id) {
        Tasks task=getById(id);
        task.setStatus(StatusTaskEnum.valueOf(Status.status()));
        return taskMapper.toResponse(taskRepo.save(task));
    }

    @Override
    public TaskResponse updateLevel(LevelRequest level, String id) {
        Tasks task=getById(id);
        task.setLevel(LevelEnum.valueOf(level.level()));
        return taskMapper.toResponse(taskRepo.save(task));
    }

    @Override
    public TaskResponse updateCompletedStatus(String id) {
        Tasks task=getById(id);
        task.setStatus(StatusTaskEnum.Complete);
        task.setCompleteAt(LocalDateTime.now());
        return taskMapper.toResponse(taskRepo.save(task));
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
