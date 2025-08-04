package com.example.productservice.Repo.Specification;

import com.example.productservice.Model.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasProductName(String productName) {
        return (root, query, criteriaBuilder) ->
                productName == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), "%" + productName.toLowerCase() + "%");
    }

    public static Specification<Product> hasSku(String sku) {
        return (root, query, criteriaBuilder) ->
                sku == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")),
                        "%" + sku.toLowerCase() + "%");
    }

    public static Specification<Product> hasSupplier(String supplier) {
        return (root, query, criteriaBuilder) ->
                supplier == null ? null : criteriaBuilder.equal(root.get("supplier"), supplier);
    }

    public static Specification<Product> isActive(Boolean isActive) {
        return (root, query, criteriaBuilder) ->
                isActive == null ? null : criteriaBuilder.equal(root.get("IsActive"), isActive);
    }
    public static Specification<Product> isDelete(Boolean isDelete) {
        return (root, query, criteriaBuilder) ->
                isDelete == null ? null : criteriaBuilder.equal(root.get("isDeleted"), isDelete);
    }
    public static Specification<Product> hasCategoryId(String categoryId) {
        return (root, query, criteriaBuilder) ->
                categoryId == null ? null : criteriaBuilder.equal(root.get("category").get("categoryId"), categoryId);
    }

    public static Specification<Product> hasUnitId(String unitId) {
        return (root, query, criteriaBuilder) ->
                unitId == null ? null : criteriaBuilder.equal(root.get("unit").get("unitID"), unitId);
    }
}
