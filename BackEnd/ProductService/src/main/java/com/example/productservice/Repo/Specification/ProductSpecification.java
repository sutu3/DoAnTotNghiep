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
                sku == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")), "%" + sku.toLowerCase() + "%");
    }
    public static Specification<Product> hasWarehouses(String warehouses) {
        return (root, query, criteriaBuilder) ->
                warehouses == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("warehouses")), "%" + warehouses.toLowerCase() + "%");
    }

    public static Specification<Product> hasSupplier(String supplier) {
        return (root, query, criteriaBuilder) ->
                supplier == null ? null : criteriaBuilder.equal(root.get("supplier"), supplier);
    }

    public static Specification<Product> isActive(Boolean isActive) {
        return (root, query, criteriaBuilder) ->
                isActive == null ? null : criteriaBuilder.equal(root.get("IsActive"), isActive);
    }
}
