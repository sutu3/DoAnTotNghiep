package com.example.userservice.Service;

import com.example.userservice.Dto.Request.LevelRequest;
import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Form.TaskForm;
import com.example.userservice.Model.Tasks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Service;

@Service
public interface TaskService {
    Page<TaskResponse> getAll(Pageable pageable,String warehouseId,String TaskName);
    Page<TaskResponse> getAllByTaskTypeId(Pageable pageable,String taskTypeId,String warehouseId);
    Tasks getById(String id);
    TaskResponse getByIdToResponse(String id);
    Tasks createTask(TaskRequest request);
    TaskResponse updateTask(TaskForm update,String id);
    TaskResponse updateStatus(StatusRequest Status, String id);
    TaskResponse updateLevel(LevelRequest level, String id);
    TaskResponse updateCompletedStatus(String id);
    String deleteTask(String id);
    TaskResponse entry(Tasks task);
}
