package com.example.order.Repo.Specification;


import com.example.order.Module.ExportOrder;
import org.springframework.data.jpa.domain.Specification;


public class ExportOrderSpecification {

    public static Specification<ExportOrder> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<ExportOrder> hasWarehouse(String warehouseId) {
        return (root, query, cb) ->
                warehouseId == null ? null : cb.equal(root.get("warehouse"), warehouseId);
    }


}
