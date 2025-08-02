package com.example.order.Repo;

import com.example.order.Module.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryItemRepo extends JpaRepository<DeliveryItem, String> {
    List<DeliveryItem> findByWarehouseDelivery_DeliveryIdAndIsDeleted(String deliveryId, Boolean isDeleted);
}
