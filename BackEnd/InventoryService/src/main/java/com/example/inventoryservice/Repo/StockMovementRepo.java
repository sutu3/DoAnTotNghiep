package com.example.inventoryservice.Repo;

import com.example.inventoryservice.Enum.MovementType;
import com.example.inventoryservice.Module.StockMovement;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepo extends JpaRepository<StockMovement, String>, JpaSpecificationExecutor<StockMovement> {

    // Tìm theo inventory warehouse
    Page<StockMovement> findAllByInventoryWarehouseIdAndIsDeleted(String inventoryWarehouseId, Boolean isDeleted, Pageable pageable);

    // Tìm theo product
    Page<StockMovement> findAllByProductAndIsDeleted(String product, Boolean isDeleted, Pageable pageable);

    // Tìm theo loại movement
    Page<StockMovement> findAllByMovementTypeAndIsDeleted(MovementType movementType, Boolean isDeleted, Pageable pageable);

    // Tìm theo reference order
    List<StockMovement> findAllByReferenceOrderIdAndIsDeleted(String referenceOrderId, Boolean isDeleted);

    // Tìm theo người thực hiện
    Page<StockMovement> findAllByPerformedByAndIsDeleted(String performedBy, Boolean isDeleted, Pageable pageable);

    @Query("SELECT sm FROM StockMovement sm " +
            "WHERE sm.inventoryWarehouseId IN (" +
            "    SELECT iw.inventoryWarehouseId FROM InventoryWarehouse iw " +
            "    WHERE iw.warehouse = :warehouseId" +
            ") " +
            "AND sm.createdAt BETWEEN :fromDate AND :toDate " +
            "ORDER BY sm.createdAt DESC")
    List<StockMovement> findByWarehouseAndDateRange(
            @Param("warehouseId") String warehouseId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );
    // Tìm theo khoảng thời gian
    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate")
    List<StockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Lấy movement gần nhất của một inventory warehouse
    @Query("SELECT sm FROM StockMovement sm WHERE sm.inventoryWarehouseId = :inventoryWarehouseId ORDER BY sm.createdAt DESC")
    List<StockMovement> findLatestMovementsByInventoryWarehouse(@Param("inventoryWarehouseId") String inventoryWarehouseId, Pageable pageable);

    // Thống kê movement theo type trong khoảng thời gian
    @Query("SELECT sm.movementType, COUNT(sm), SUM(sm.quantity) FROM StockMovement sm WHERE sm.createdAt BETWEEN :startDate AND :endDate GROUP BY sm.movementType")
    List<Object[]> getMovementStatsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
