package com.example.productservice.Repo;

import com.example.productservice.Model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category,String>, JpaSpecificationExecutor<Category> {
    Page<Category> findAllByIsDeleted(boolean isdeleted, Pageable pageable);
    List<Category> findAllByIsDeleted(boolean isdeleted);
    Optional<Category> findByCategoryNameAndIsDeleted(String name, boolean isdeleted);
    Optional<Category> findByCategoryName(String name);
    Optional<Category> findByCategoryIdAndIsDeleted(String id, boolean b);
}
