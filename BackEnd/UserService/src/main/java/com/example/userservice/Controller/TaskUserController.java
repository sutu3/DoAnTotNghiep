package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Service.TaskUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/taskUsers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskUserController {
    private final TaskUserService taskUserService;

    @GetMapping("/users/search?page={pageNumber}&size={pageSize}&idUser={id}")
    public ApiResponse<Page<TaskUserResponse>> getAllByIdUser(
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("id") String UserId
    ){
        Pageable pageable= PageRequest.of(pageNumber,pageSize);
        return ApiResponse.<Page<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByUserId(UserId,pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/tasks/search?page={pageNumber}&size={pageSize}&idTask={id}")
    public ApiResponse<Page<TaskUserResponse>> getAllByIdTask(
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("id") String TaskId
    ){
        Pageable pageable= PageRequest.of(pageNumber,pageSize);
        return ApiResponse.<Page<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByTaskId(TaskId,pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/taskType/search?page={pageNumber}&size={pageSize}&idTask={id}")
    public ApiResponse<Page<TaskUserResponse>> getAllByTaskType(
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("taskTypeName") String taskName
    ){
        Pageable pageable= PageRequest.of(pageNumber,pageSize);
        return ApiResponse.<Page<TaskUserResponse>>builder()
                .Result(taskUserService.getAllByTaskTypeName(taskName,pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<TaskUserResponse> createTaskUser(
            @RequestBody TaskUserRequest request
            ){
        return ApiResponse.<TaskUserResponse>builder()
                .Result(taskUserService.createTaskUser(request))
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
