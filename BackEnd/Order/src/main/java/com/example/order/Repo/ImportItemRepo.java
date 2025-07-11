package com.example.order.Repo;

import com.example.order.Enum.OrderStatus;
import com.example.order.Module.ImportItem;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ImportItemRepo extends JpaRepository<ImportItem,String>, JpaSpecificationExecutor<ImportItem> {
    Page<ImportItem> findAllByWarehouseAndIsDeleted(String warehouse, Boolean isDeleted, Pageable pageable);
    List<ImportItem> findAllByImportOrder_ImportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);
    Integer countByImportOrder_ImportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);
    @Query("SELECT ii FROM ImportItem ii WHERE ii.product = :productId AND ii.warehouse = :warehouseId " +
            "AND ii.importAt >= :fromDate AND ii.isDeleted = :isDeleted " +
            "ORDER BY ii.importAt DESC")
    List<ImportItem> findRecentImportItemsByProductAndWarehouse(
            @Param("productId") String productId,
            @Param("warehouseId") String warehouseId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("isDeleted") Boolean isDeleted
    );
    @Query("SELECT COALESCE(SUM(ii.requestQuantity), 0) FROM ImportItem ii " +
            "JOIN ii.importOrder io " +
            "WHERE ii.product = :productId AND ii.warehouse = :warehouseId " +
            "AND io.status IN :pendingStatuses AND ii.isDeleted = :isDeleted")
    Integer countPendingItemsByProductAndWarehouse(
            @Param("productId") String productId,
            @Param("warehouseId") String warehouseId,
            @Param("pendingStatuses") List<OrderStatus> pendingStatuses,
            @Param("isDeleted") Boolean isDeleted
    );
}
