package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskUserAndTaskRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Service.TaskUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taskUsers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "TackUser API", description = "Quản lý phân loại Nhiệm vụ cua người dùng trong kho")

public class TaskUserController {
    private final TaskUserService taskUserService;

    @GetMapping("/search/users")
    public ApiResponse<Page<TaskUserResponse>> getAllByIdUser(
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize
    ){
        Pageable pageable= PageRequest.of(pageNumber,pageSize);
        return ApiResponse.<Page<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByUserId(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/tasks/{id}")
    public ApiResponse<List<TaskUserResponse>> getAllByIdTask(
            @PathVariable String id
    ){
        return ApiResponse.<List<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByTaskId(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouse/{warehouseId}/taskTypes/taskName/{taskName}")
    public ApiResponse<Page<TaskUserResponse>> getAllByTaskType(
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize,
            @PathVariable String taskName,
            @PathVariable String warehouseId
    ){
        Pageable pageable= PageRequest.of(pageNumber,pageSize);
        return ApiResponse.<Page<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByTaskTypeName(taskName,warehouseId,pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<List<TaskUserResponse>> createTaskUser(
            @RequestBody TaskUserAndTaskRequest request
            ){
        return ApiResponse.<List<TaskUserResponse>>builder()
                .Result(taskUserService.createTaskUsers(request.request(),request.tasks()))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<TaskUserResponse> createTaskUser(
            @PathVariable String id
    ){
        return ApiResponse.<TaskUserResponse>builder()
                .Result(taskUserService.findByIdToResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}/status")
    public ApiResponse<TaskUserResponse> updateTaskUserStatus(
            @RequestBody StatusRequest request,
            @PathVariable String id
    ){
        return ApiResponse.<TaskUserResponse>builder()
                .Result(taskUserService.updateTaskUserStatus(request,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTaskName(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(taskUserService.deleteTaskUser(id))
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
