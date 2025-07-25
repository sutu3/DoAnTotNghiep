package com.example.userservice.Repo;

import com.example.userservice.Model.TaskUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskUserRepo extends JpaRepository<TaskUser,String>, JpaSpecificationExecutor<TaskUser> {
   Page<TaskUser> findAllByUser_UserId(String id, Pageable pageable);
   List<TaskUser> findAllByTask_TaskId(String id);
   Page<TaskUser> findAllByTask_TaskType_TaskName(String taskName, Pageable pageable);
}
