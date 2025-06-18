package com.example.userservice.Service;

import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Form.TaskTypeForm;
import com.example.userservice.Model.TaskType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface TaskTypeService {
    Page<TaskTypeResponse> getAll(Pageable pageable,String warehouse);

    TaskType getByTaskName(String taskName,String warehouses);
    TaskType getByid(String id);
    TaskTypeResponse getByTaskNametoResponse(String taskName,String warehouses);
    TaskTypeResponse createTaskType(TaskTypeRequest request);
    TaskTypeResponse updateTaskType(TaskTypeForm update,String id);
    String deleteByTaskName(String taskName,String warehouses);
}
