package com.example.userservice.Repo;

import com.example.userservice.Model.TaskType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskTypeRepo extends JpaRepository<TaskType,String>, JpaSpecificationExecutor<TaskType> {
    Page<TaskType> findAllByIsDeletedAndWarehouses(boolean isDeleted,String warehouse, Pageable pageable);
    boolean existsByTaskName(String name);
    Optional<TaskType> findByTaskNameAndWarehouses(String taskName,String warehouses);

}
