package com.example.userservice.Repo;

import com.example.userservice.Model.Tasks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TaskRepo extends JpaRepository<Tasks,String>, JpaSpecificationExecutor<Tasks> {
    Page<Tasks> findAllByIsDeletedAndWarehouses(boolean isdeleted, String warehouse, Pageable pageable);
}
