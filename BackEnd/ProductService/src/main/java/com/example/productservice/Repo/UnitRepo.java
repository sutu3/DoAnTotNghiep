package com.example.productservice.Repo;

import com.example.productservice.Model.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepo extends JpaRepository<Unit,String>, JpaSpecificationExecutor<Unit> {
    Page<Unit> findAllByIsDeleted(Boolean isDelete, Pageable pageable);
    List<Unit> findAllByIsDeleted(Boolean isDelete);

    Page<Unit> findAllByGroupUnit_GroupNameAndIsDeleted(String groupName, Boolean isDeleted, Pageable pageable);
    Optional<Unit> findByShortNameAndUnitName(String shortName,String unitName);
}
