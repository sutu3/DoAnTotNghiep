package com.example.order.Repo;

import com.example.order.Enum.OrderStatus;
import com.example.order.Module.ImportOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface ImportOrderRepo extends JpaRepository<ImportOrder,String>, JpaSpecificationExecutor<ImportOrder> {
    Page<ImportOrder> findAllByWarehouseAndIsDeleted(String warehouse, boolean isDeleted, Pageable pageable);
    Page<ImportOrder> findAllByWarehouseAndStatusAndIsDeleted(String warehouse, OrderStatus status, Boolean isDeleted, Pageable pageable);
}
