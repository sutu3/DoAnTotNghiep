package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Warehouses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepo extends JpaRepository<Warehouses,String>, JpaSpecificationExecutor<Warehouses> {
/*
    @Query("SELECT w FROM Warehouses w WHERE w.isDeleted = false")
*/
    Page<Warehouses> findAllByIsDeletedFalse(Pageable pageable);
    Page<Warehouses> findByWarehouseName(String warehouseName, Pageable pageable);
    boolean existsByManagerId(String managerId);
    Optional<Warehouses> findByManagerId(String managerId);
}
