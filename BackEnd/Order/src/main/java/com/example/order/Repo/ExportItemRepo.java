package com.example.order.Repo;

import com.example.order.Enum.ExportItemStatus;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Module.ExportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExportItemRepo extends JpaRepository<ExportItem, String> {

    List<ExportItem> findAllByExportOrder_ExportOrderIdAndIsDeleted(String exportOrderId,boolean isDeleted);
    Page<ExportItem> findAllByExportOrder_Warehouse(String warehouse, Pageable pageable);
    List<ExportItem> findByProductAndIsDeletedFalse(String product);

    List<ExportItem> findByStatusAndIsDeletedFalse(ExportItemStatus status);

    @Query("SELECT ei FROM ExportItem ei WHERE ei.exportOrder.exportOrderId = :orderId AND ei.status = :status AND ei.isDeleted = false")
    List<ExportItem> findByOrderIdAndStatus(@Param("orderId") String orderId, @Param("status") ExportItemStatus status);
    @Query("SELECT COALESCE(SUM(ii.quantity), 0) FROM ExportItem ii " +
            "JOIN ii.exportOrder io " +
            "WHERE ii.product = :productId AND io.warehouse = :warehouseId " +
            "AND io.status = 'APPROVED' AND ii.isDeleted = :isDeleted")
    Integer countApprovedItemsByProductAndWarehouse(
            @Param("productId") String productId,
            @Param("warehouseId") String warehouseId,
            @Param("isDeleted") Boolean isDeleted
    );
    Integer countByProductAndIsDeletedAndExportOrder_StatusAndExportOrder_Warehouse(String product, Boolean isDeleted, ExportOrderStatus status, String warehouse);
}