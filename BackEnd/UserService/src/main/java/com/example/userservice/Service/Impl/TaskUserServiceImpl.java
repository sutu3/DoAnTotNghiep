package com.example.userservice.Service.Impl;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Enum.StatusTaskUserEnum;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Mapper.TaskUserMapper;
import com.example.userservice.Model.TaskUser;
import com.example.userservice.Model.Tasks;
import com.example.userservice.Model.Users;
import com.example.userservice.Repo.TaskUserRepo;
import com.example.userservice.Service.TaskService;
import com.example.userservice.Service.TaskTypeService;
import com.example.userservice.Service.TaskUserService;
import com.example.userservice.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskUserServiceImpl implements TaskUserService {
    TaskUserMapper taskUserMapper;
    UserService userService;
    TaskUserRepo taskUserRepo;
    TaskService taskService;
    TaskTypeService taskTypeService;

    @Override
    public Page<TaskUserResponse> getAllByUserId(String id, Pageable pageable) {
        userService.findById(id);
        return taskUserRepo.findAllByUser_UserId(id,pageable).map(taskUserMapper::toResponse);
    }

    @Override
    public List<TaskUserResponse> getAllByTaskId(String id) {
        taskService.getById(id);
        return taskUserRepo.findAllByTask_TaskId(id).stream().map(taskUserMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Page<TaskUserResponse> getAllByTaskTypeName(String taskName,String warehouseId, Pageable pageable) {
        taskTypeService.getByTaskName(taskName,warehouseId);
        return taskUserRepo.findAllByTask_TaskType_TaskName(taskName,pageable)
                .map(taskUserMapper::toResponse);
    }

    @Override
    public TaskUserResponse createTaskUser(TaskUserRequest request,Tasks task) {
        Users user=userService.findById(request.user());
        TaskUser taskUser=taskUserMapper.toEntity(request);
        taskUser.setStatus(StatusTaskUserEnum.Pending);
        taskUser.setIsDeleted(false);
        taskUser.setTask(task);
        taskUser.setUser(user);
        return taskUserMapper.toResponse(taskUserRepo.save(taskUser));
    }

    @Override
    public List<TaskUserResponse> createTaskUsers(TaskRequest request, List<TaskUserRequest> tasks) {
        Tasks taskCreate = taskService.createTask(request);
        List<TaskUserResponse> results = tasks.stream()
                .map(taskUserReq -> createTaskUser(taskUserReq, taskCreate))
                .toList();
        return results;
    }

    @Override
    public TaskUser findById(String id) {
        return taskUserRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.TASK_USER_NOT_FOUND));
    }

    @Override
    public TaskUserResponse findByIdToResponse(String id) {
        return taskUserMapper.toResponse(findById(id));
    }

    @Override
    public TaskUserResponse updateTaskUserStatus(StatusRequest statusRequest, String id) {
        TaskUser taskUser=findById(id);
        taskUser.setStatus(StatusTaskUserEnum.valueOf(statusRequest.status()));
        return taskUserMapper.toResponse(taskUserRepo.save(taskUser));
    }

    @Override
    public String deleteTaskUser(String id) {
        TaskUser taskUser=findById(id);
        taskUserRepo.deleteById(id);
        return "Deleted Completed";
    }
}
