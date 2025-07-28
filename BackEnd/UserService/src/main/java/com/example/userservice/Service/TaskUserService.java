package com.example.userservice.Service;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Model.TaskUser;
import com.example.userservice.Model.Tasks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TaskUserService {
    Page<TaskUserResponse> getAllByUserId( Pageable pageable);
    List<TaskUserResponse> getAllByTaskId(String id);
    Page<TaskUserResponse> getAllByTaskTypeName(String taskName,String warehouseId, Pageable pageable);
    TaskUserResponse createTaskUser(TaskUserRequest request, Tasks task);
    List<TaskUserResponse> createTaskUsers(TaskRequest request, List<TaskUserRequest> tasks);
    TaskUser findById(String id);
    TaskUserResponse findByIdToResponse(String id);
    TaskUserResponse updateTaskUserStatus(StatusRequest statusRequest,String id);
    String deleteTaskUser(String id);
}
