package com.example.order.Repo;

import com.example.order.Enum.ReceiptStatus;
import com.example.order.Module.WarehouseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface WarehouseReceiptRepo extends JpaRepository<WarehouseReceipt, String>, JpaSpecificationExecutor<WarehouseReceipt> {
    List<WarehouseReceipt> findAllByImportOrder_ImportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);
    List<WarehouseReceipt> findAllByStatusAndIsDeleted(ReceiptStatus status, Boolean isDeleted);
    List<WarehouseReceipt> findAllByWarehouseAndIsDeleted(String warehouseId, Boolean isDeleted);

}
