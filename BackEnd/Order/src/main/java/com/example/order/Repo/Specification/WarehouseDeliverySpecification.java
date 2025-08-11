package com.example.order.Repo.Specification;

import com.example.order.Module.WarehouseDelivery;
import org.springframework.data.jpa.domain.Specification;

public class WarehouseDeliverySpecification {
    public static Specification<WarehouseDelivery> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<WarehouseDelivery> hasWarehouse(String warehouseId) {
        return (root, query, cb) ->
                warehouseId == null ? null : cb.equal(root.get("warehouse"), warehouseId);
    }
    public static Specification<WarehouseDelivery> hasDeliveryId(String deliveryId) {
        return (root, query, cb) ->
                (deliveryId == null || deliveryId.isBlank() || deliveryId.equals("0"))
                        ? null
                        : cb.like(root.get("deliveryId"), "%" + deliveryId + "%");
    }
}
