package com.example.order.Repo.Specification;

import com.example.order.Module.WarehouseReceipt;
import org.springframework.data.jpa.domain.Specification;

public class WarehouseReceiptSpecification {
    public static Specification<WarehouseReceipt> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<WarehouseReceipt> hasWarehouse(String warehouseId) {
        return (root, query, cb) ->
                warehouseId == null ? null : cb.equal(root.get("warehouse"), warehouseId);
    }
    public static Specification<WarehouseReceipt> hasReceiptId(String receiptId) {
        return (root, query, cb) ->
                (receiptId == null || receiptId.isBlank() || receiptId.equals("0"))
                        ? null
                        : cb.like(root.get("receiptId"), "%" + receiptId + "%");
    }
    public static Specification<WarehouseReceipt> isDelete(Boolean isDelete) {
        return (root, query, criteriaBuilder) ->
                isDelete == null ? null : criteriaBuilder.equal(root.get("isDeleted"), isDelete);
    }
}
