package com.example.userservice.Service.Impl;

import com.example.userservice.Dto.Request.StatusRequest;
import com.example.userservice.Dto.Request.TaskRequest;
import com.example.userservice.Dto.Request.TaskUserRequest;
import com.example.userservice.Dto.Responses.TaskUser.StatsResponse;
import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponse;
import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import com.example.userservice.Enum.StatusTaskUserEnum;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Form.EvidenceImages;
import com.example.userservice.Form.NoteForm;
import com.example.userservice.Mapper.TaskUserMapper;
import com.example.userservice.Model.TaskUser;
import com.example.userservice.Model.Tasks;
import com.example.userservice.Model.Users;
import com.example.userservice.Repo.TaskRepo;
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
    TaskRepo taskRepo;
    TaskService taskService;
    TaskTypeService taskTypeService;
    private final GetCurrentUserId getCurrentUserId;

    @Override
    public Page<TaskUserResponse> getAllByUserId( Pageable pageable) {
        var userId=GetCurrentUserId.getCurrentUserId();
        userService.findById(userId);
        List<StatusTaskEnum> statuses = List.of(StatusTaskEnum.In_Progress, StatusTaskEnum.Complete);
        return taskUserRepo.findAllByUser_UserIdAndTask_StatusIn(userId,statuses,pageable).map(taskUserMapper::toResponse);
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
    public TaskUserResponse updateTaskUserCancel(String id, NoteForm note) {
        TaskUser taskUser = findById(id);
        if(taskUser.getStatus() == StatusTaskUserEnum.Complete) {
            throw new AppException(ErrorCode.TASK_USER_CANNOT_BE_CANCELLED);
        }
        String noteUser = "Task cancelled For: " + note;
        taskUser.setStatus(StatusTaskUserEnum.Cancel);
        taskUser.setNote(STR."\{taskUser.getNote()} \{noteUser}");
        return taskUserMapper.toResponse(taskUserRepo.save(taskUser));
    }
    @Override
    public TaskUserResponse updateTaskUserCompleted(EvidenceImages request, String id) {
        TaskUser taskUser = findById(id);
        if(taskUser.getStatus() != StatusTaskUserEnum.In_Progress) {
            throw new AppException(ErrorCode.TASK_USER_CANNOT_BE_COMPLETED);
        }
        if(taskUser.getTask().getRequiresEvidence()){
            if(request.evidenceImages() == null || request.evidenceImages().isEmpty()) {
                throw new AppException(ErrorCode.EVIDENCE_IMAGES_REQUIRED);
            }
            taskUser.setEvidenceImages(request.evidenceImages());
        }
        taskUser.setEvidenceImages(request.evidenceImages());
        taskUser.setStatus(StatusTaskUserEnum.Complete);
        return taskUserMapper.toResponse(taskUserRepo.save(taskUser));
    }

    @Override
    public StatsResponse getStatsByUserId() {
        var userId = GetCurrentUserId.getCurrentUserId();
        Integer pendingCount = taskUserRepo.countByStatusAndUser_UserIdAndIsDeleted( StatusTaskUserEnum.Pending,userId,false);
        Integer InProgressCount = taskUserRepo.countByStatusAndUser_UserIdAndIsDeleted( StatusTaskUserEnum.In_Progress,userId,false);
        Integer completeCount = taskUserRepo.countByStatusAndUser_UserIdAndIsDeleted( StatusTaskUserEnum.Complete,userId,false);
        Integer hightCount=taskUserRepo.countByTask_LevelAndUser_UserIdAndIsDeleted( LevelEnum.Hight,userId,false);
        Integer totalTasks = taskUserRepo.countByUser_UserIdAndIsDeleted(userId, false);
        StatsResponse statsResponse = StatsResponse.builder()
                .totalTasks(totalTasks)
                .totalTasksCompleted(completeCount)
                .totalTasksHightLevel(hightCount)
                .totalTasksInProgress(InProgressCount)
                .totalTasksPending(pendingCount)
                .build();
        return statsResponse;
    }

    @Override
    public String deleteTaskUser(String id) {
        TaskUser taskUser=findById(id);
        taskUserRepo.deleteById(id);
        return "Deleted Completed";
    }
}
