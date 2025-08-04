package com.example.order.Repo.Specification;


import com.example.order.Enum.OrderType;
import com.example.order.Module.ImportOrder;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ImportOrderSpecification {

    public static Specification<ImportOrder> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<ImportOrder> hasWarehouse(String warehouseId) {
        return (root, query, cb) ->
                warehouseId == null ? null : cb.equal(root.get("warehouse"), warehouseId);
    }

    public static Specification<ImportOrder> hasType(OrderType type) {
        return (root, query, cb) ->
                type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<ImportOrder> hasCreatedBy(String createByUser) {
        return (root, query, cb) ->
                createByUser == null ? null : cb.like(cb.lower(root.get("createByUser")), "%" + createByUser.toLowerCase() + "%");
    }

    public static Specification<ImportOrder> hasNoteLike(String note) {
        return (root, query, cb) ->
                note == null ? null : cb.like(cb.lower(root.get("note")), "%" + note.toLowerCase() + "%");
    }

    public static Specification<ImportOrder> hasMinTotalPrice(BigDecimal minPrice) {
        return (root, query, cb) ->
                minPrice == null ? null : cb.greaterThanOrEqualTo(root.get("totalPrice"), minPrice);
    }

    public static Specification<ImportOrder> hasMaxTotalPrice(BigDecimal maxPrice) {
        return (root, query, cb) ->
                maxPrice == null ? null : cb.lessThanOrEqualTo(root.get("totalPrice"), maxPrice);
    }
}
