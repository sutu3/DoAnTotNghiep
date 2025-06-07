package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.TaskTypeRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.TaskType.TaskTypeResponse;
import com.example.userservice.Form.TaskTypeForm;
import com.example.userservice.Repo.TaskTypeRepo;
import com.example.userservice.Service.TaskTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/TaskTypes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class TaskTypeController {

    TaskTypeRepo taskTypeRepo;
    private final TaskTypeService taskTypeService;

    @GetMapping("/search?page={pageNumber}&size={pageSize}")
    public ApiResponse<Page<TaskTypeResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<TaskTypeResponse>>builder()
                .Result(taskTypeService.getAll(pageable))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/{taskName}")
    public ApiResponse<TaskTypeResponse> getByTaskName(@PathVariable String taskName){
        return ApiResponse.<TaskTypeResponse>builder()
                .Result(taskTypeService.getByTaskNametoResponse(taskName))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<TaskTypeResponse> createTaskType(@RequestBody TaskTypeRequest request){
        return ApiResponse.<TaskTypeResponse>builder()
                .Result(taskTypeService.createTaskType(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<TaskTypeResponse> updateTaskType(
            @RequestBody TaskTypeForm update,
            @PathVariable String id){
        return ApiResponse.<TaskTypeResponse>builder()
                .Result(taskTypeService.updateTaskType(update,id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @DeleteMapping("/{taskName}")
    public ApiResponse<String> deleteTaskName(@PathVariable String taskName){
        return ApiResponse.<String>builder()
                .Result(taskTypeService.deleteByTaskName(taskName))
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
