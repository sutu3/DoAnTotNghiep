package com.example.userservice.Repo;

import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import com.example.userservice.Enum.StatusTaskUserEnum;
import com.example.userservice.Model.TaskUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskUserRepo extends JpaRepository<TaskUser,String>, JpaSpecificationExecutor<TaskUser> {
   Page<TaskUser> findAllByUser_UserIdAndTask_StatusIn(String userId, List<StatusTaskEnum> statuses, Pageable pageable);
   List<TaskUser> findAllByTask_TaskId(String id);
   Integer countByUser_UserIdAndIsDeleted(String userId, Boolean isDeleted);
   Integer countByStatusAndUser_UserIdAndIsDeleted(StatusTaskUserEnum status, String user_userId, Boolean isDeleted);
   Integer countByTask_LevelAndUser_UserIdAndIsDeleted(LevelEnum levelEnum, String user_userId, Boolean isDeleted);
   Page<TaskUser> findAllByTask_TaskType_TaskName(String taskName, Pageable pageable);
}
