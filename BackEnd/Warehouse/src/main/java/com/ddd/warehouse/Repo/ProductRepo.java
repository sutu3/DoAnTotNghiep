package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product,String> {
    boolean existsBySkuCode(String name);
}
