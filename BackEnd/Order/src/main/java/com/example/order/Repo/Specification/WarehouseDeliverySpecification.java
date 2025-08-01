package com.example.order.Repo.Specification;

import com.example.order.Module.ImportOrder;
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
}
