package com.example.order.Repo;

import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Module.ExportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExportOrderRepo extends JpaRepository<ExportOrder, String> {

    Page<ExportOrder> findAllByWarehouseAndIsDeletedFalse(String warehouse, Pageable pageable);

    Page<ExportOrder> findAllByCreateByUserAndIsDeletedFalse(String createByUser, Pageable pageable);

    Page<ExportOrder> findAllByStatusAndIsDeletedFalse(ExportOrderStatus status, Pageable pageable);

    List<ExportOrder> findByStatusInAndIsDeletedFalse(List<ExportOrderStatus> statuses);

    @Query("SELECT e FROM ExportOrder e WHERE e.deliveryDate BETWEEN :startDate AND :endDate AND e.isDeleted = false")
    List<ExportOrder> findByDeliveryDateBetween(@Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    Optional<ExportOrder> findByExportOrderIdAndIsDeletedFalse(String exportOrderId);
}
