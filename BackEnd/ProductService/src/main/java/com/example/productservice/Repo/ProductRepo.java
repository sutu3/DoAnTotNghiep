package com.example.productservice.Repo;

import com.example.productservice.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product,String>, JpaSpecificationExecutor<Product> {
    Page<Product> findAllByIsDeleted(boolean isDeleted, Pageable pageable);
    Optional<Product> findBySkuAndIsDeleted(String sku,boolean isDeleted);
    Page<Product> findAllBySupplierAndIsDeleted(String supplier,boolean isDeleted, Pageable pageable);
    Optional<Product> findBySku(String sku);
}
