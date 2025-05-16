package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<Category,String> {
    boolean existsByCategoryName(String name);
}
