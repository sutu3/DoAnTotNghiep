package com.example.userservice.Service.Impl;

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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskTypeServiceImpl implements TaskTypeService {
    private final TaskTypeMapper taskTypeMapper;
    private final TaskTypeRepo taskTypeRepo;

    @Override
    public Page<TaskTypeResponse> getAll(Pageable pageable) {
        return taskTypeRepo.findAllByIsDeleted(false, pageable)
                .map(taskTypeMapper::toResponse);
    }

    @Override
    public TaskType getByTaskName(String taskName) {
        return taskTypeRepo.findByTaskName(taskName)
                .orElseThrow(()->new AppException(ErrorCode.TASK_TYPE_NOT_FOUND));
    }

    @Override
    public TaskType getByid(String id) {
        return taskTypeRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.TASK_TYPE_NOT_FOUND));
    }

    @Override
    public TaskTypeResponse getByTaskNametoResponse(String taskName) {
        return taskTypeMapper.toResponse(getByTaskName(taskName));
    }

    @Override
    public TaskTypeResponse createTaskType(TaskTypeRequest request) {

        Optional<TaskType> existing = taskTypeRepo.findByTaskName(request.taskName());
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
        return taskTypeMapper.toResponse(taskTypeRepo.save(taskType));
    }


    @Override
    public TaskTypeResponse updateTaskType(TaskTypeForm update,String id) {
        if(taskTypeRepo.existsByTaskName(update.taskName())){
            throw new AppException(ErrorCode.TASK_TYPE_EXIST);
        }
        TaskType taskType=getByid(id);
        taskTypeMapper.update(taskType,update);
        return taskTypeMapper.toResponse(taskTypeRepo.save(taskType));
    }

    @Override
    public String deleteByTaskName(String taskName) {
        TaskType taskType=getByTaskName(taskName);
        taskType.setDeletedAt(LocalDateTime.now());
        taskType.setIsDeleted(true);
        taskTypeRepo.save(taskType);
        return "Deleted Completed";
    }

}
