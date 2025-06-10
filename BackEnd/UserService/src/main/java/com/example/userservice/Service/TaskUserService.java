package com.example.userservice.Service;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Model.TaskUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

@Service
public interface TaskUserService {
    Page<TaskUserResponse> getAllByUserId(String id, Pageable pageable);
    Page<TaskUserResponse> getAllByTaskId(String id, Pageable pageable);
    Page<TaskUserResponse> getAllByTaskTypeName(String taskName, Pageable pageable);
    TaskUserResponse createTaskUser(TaskUserRequest request);
    TaskUser findById(String id);
    TaskUserResponse findByIdToResponse(String id);
    TaskUserResponse updateTaskUserStatus(StatusRequest statusRequest,String id);
    String deleteTaskUser(String id);
}
