package com.example.order.Repo;

import com.example.order.Enum.OrderStatus;
import com.example.order.Module.ImportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ImportOrderRepo extends JpaRepository<ImportOrder,String>, JpaSpecificationExecutor<ImportOrder> {
    Page<ImportOrder> findAllByWarehouseAndIsDeleted(String warehouse, boolean isDeleted, Pageable pageable);
    Page<ImportOrder> findAllByWarehouseAndStatusAndIsDeleted(String warehouse, OrderStatus status, Boolean isDeleted, Pageable pageable);
    List<ImportOrder> findAllByWarehouseAndCreatedAtBetweenAndIsDeleted(
            String warehouse, LocalDateTime fromDate, LocalDateTime toDate, Boolean isDeleted);

    List<ImportOrder> findAllByWarehouseAndStatusInAndIsDeleted(
            String warehouse, List<OrderStatus> statuses, Boolean isDeleted);
    List<ImportOrder> findAllByWarehouseAndStatusAndIsDeleted(
            String warehouse, OrderStatus statuses, Boolean isDeleted);

    List<ImportOrder> findAllByWarehouseAndStatusAndCreatedAtBetweenAndIsDeleted(
            String warehouse, OrderStatus status, LocalDateTime fromDate, LocalDateTime toDate, Boolean isDeleted);
}
