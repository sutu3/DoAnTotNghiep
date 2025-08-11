package com.example.order.Repo;

import com.example.order.Enum.DeliveryStatus;
import com.example.order.Module.ExportOrder;
import com.example.order.Module.WarehouseDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseDeliveryRepo extends JpaRepository<WarehouseDelivery, String>, JpaSpecificationExecutor<WarehouseDelivery> {
    List<WarehouseDelivery> findAllByExportOrder_ExportOrderIdAndIsDeleted(String orderId, Boolean isDeleted);
    List<WarehouseDelivery> findAllByStatusAndIsDeleted(DeliveryStatus status, Boolean isDeleted);
    List<WarehouseDelivery> findAllByWarehouseAndIsDeleted(String warehouseId, Boolean isDeleted);
    Optional<WarehouseDelivery> findByExportOrder_ExportOrderIdAndIsDeleted(String exportOrder, Boolean isDeleted);
}
