package com.example.inventoryservice.Repo;

import com.example.inventoryservice.Enum.CheckSheetStatus;
import com.example.inventoryservice.Module.InventoryCheckSheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryCheckSheetRepo extends JpaRepository<InventoryCheckSheet, String>, JpaSpecificationExecutor<InventoryCheckSheet> {

    Page<InventoryCheckSheet> findAllByWarehouseAndIsDeleted(String warehouseId, Boolean isDeleted, Pageable pageable);

    List<InventoryCheckSheet> findAllByPerformedByAndIsDeleted(String performedBy, Boolean isDeleted);

    List<InventoryCheckSheet> findAllByStatusAndIsDeleted(CheckSheetStatus status, Boolean isDeleted);

    Optional<InventoryCheckSheet> findByCheckSheetNumberAndIsDeleted(String checkSheetNumber, Boolean isDeleted);

    @Query("SELECT ics FROM InventoryCheckSheet ics WHERE ics.checkDate BETWEEN :startDate AND :endDate AND ics.isDeleted = false")
    List<InventoryCheckSheet> findByCheckDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ics) FROM InventoryCheckSheet ics WHERE ics.warehouse = :warehouseId AND ics.status = :status AND ics.isDeleted = false")
    Long countByWarehouseAndStatus(@Param("warehouseId") String warehouseId, @Param("status") CheckSheetStatus status);
}
