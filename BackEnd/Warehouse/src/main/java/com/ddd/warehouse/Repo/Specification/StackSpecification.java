package com.ddd.warehouse.Repo.Specification;

import com.ddd.warehouse.Module.Stacks;
import org.springframework.data.jpa.domain.Specification;

public class StackSpecification {

    public static Specification<Stacks> hasStackName(String stackName) {
        return (root, query, cb) ->
                (stackName == null || stackName.isBlank() || stackName.equals("0"))
                        ? null
                        : cb.like(root.get("stackName"), "%" + stackName + "%");
    }
    public static Specification<Stacks> hasWarehouse(String warehouse) {
        return (root, query, cb) ->
                warehouse == null ? null : cb.equal(root.get("warehouse").get("warehouseId"), warehouse);
    }
    public static Specification<Stacks> isDelete(Boolean isDelete) {
        return (root, query, criteriaBuilder) ->
                isDelete == null ? null : criteriaBuilder.equal(root.get("isDeleted"), isDelete);
    }

}
