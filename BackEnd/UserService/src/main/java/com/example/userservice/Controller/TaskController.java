package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.LevelRequest;
import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Form.TaskForm;
import com.example.userservice.Service.TaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Tacks API", description = "Quản lý Nhiệm vụ trong kho")
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/search/warehouse/{warehouseId}")
    public ApiResponse<Page<TaskResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<TaskResponse>>builder()
                .Result(taskService.getAll(pageable,warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouse/{warehouseId}/taskType/{taskTypeId}")
    public ApiResponse<Page<TaskResponse>> getAllByTaskTypeId(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId,
            @PathVariable String taskTypeId
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<TaskResponse>>builder()
                .Result(taskService.getAllByTaskTypeId(pageable,taskTypeId,warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<TaskResponse> getById(@PathVariable String id){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.getByIdToResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<TaskResponse> createTask(@RequestBody TaskRequest request){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.createTask(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<TaskResponse> updateTask(
            @RequestBody TaskForm update,
            @PathVariable String id
    ){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.updateTask(update,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}/status")
    public ApiResponse<TaskResponse> updateTaskStatus(
            @RequestBody StatusRequest status,
            @PathVariable String id
    ){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.updateStatus(status,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}/level")
    public ApiResponse<TaskResponse> updateTaskLevel(
            @RequestBody LevelRequest levelRequest,
            @PathVariable String id
    ){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.updateLevel(levelRequest,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}/complete")
    public ApiResponse<TaskResponse> updateTaskComplete(
            @PathVariable String id
    ){
        return ApiResponse.<TaskResponse>builder()
                .Result(taskService.updateCompletedStatus(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("{id}")
    public ApiResponse<String> deleteTask(
            @PathVariable String id
    ){
        return ApiResponse.<String>builder()
                .Result(taskService.deleteTask(id))
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
