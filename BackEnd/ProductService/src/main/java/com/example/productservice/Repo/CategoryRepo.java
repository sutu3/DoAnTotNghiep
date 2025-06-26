package com.example.productservice.Repo;

import com.example.productservice.Model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category,String>, JpaSpecificationExecutor<Category> {
    Page<Category> findAllByIsDeletedAndWarehouses(boolean isdeleted,String warehouse, Pageable pageable);
    Optional<Category> findByCategoryNameAndIsDeletedAndWarehouses(String name, boolean isdeleted,String warehouse);
    Optional<Category> findByCategoryNameAndWarehouses(String name,String warehouse);
    Optional<Category> findByCategoryIdAndIsDeleted(String id, boolean b);
}
