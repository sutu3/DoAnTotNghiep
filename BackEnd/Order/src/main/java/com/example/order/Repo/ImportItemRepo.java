package com.example.order.Repo;

import com.example.order.Module.ImportItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImportItemRepo extends JpaRepository<ImportItem,String>, JpaSpecificationExecutor<ImportItem> {
    Page<ImportItem> findAllByWarehouseAndIsDeleted(String warehouse, Boolean isDeleted, Pageable pageable);
    Optional<ImportItem> findAllByImportOrder_ImportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);
    Integer countByImportOrder_ImportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);

}
