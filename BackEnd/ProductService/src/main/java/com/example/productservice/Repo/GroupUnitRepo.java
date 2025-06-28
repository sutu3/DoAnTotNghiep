package com.example.productservice.Repo;

import com.example.productservice.Model.GroupUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupUnitRepo extends JpaRepository<GroupUnit,String>, JpaSpecificationExecutor<GroupUnit> {
    Page<GroupUnit> findAllByIsDeleted(Boolean isDeleted , Pageable pageable);

    Optional<GroupUnit> findByGroupNameAndIsDeleted(String groupName,boolean isDeleted);
}
