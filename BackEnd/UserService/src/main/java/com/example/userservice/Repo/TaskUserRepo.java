package com.example.userservice.Repo;

import com.example.userservice.Model.TaskUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskUserRepo extends JpaRepository<TaskUser,String>, JpaSpecificationExecutor<TaskUser> {
   Page<TaskUser> findAllByUser_UserId(String id, Pageable pageable);
   Page<TaskUser> findAllByTask_TaskId(String id, Pageable pageable);
   Page<TaskUser> findAllByTask_TaskType_TaskName(String taskName, Pageable pageable);
}
