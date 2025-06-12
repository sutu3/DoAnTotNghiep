package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Stacks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface StackRepo extends JpaRepository<Stacks,String>, JpaSpecificationExecutor<Stacks> {
    Page<Stacks> findAllByIsDeleted(Pageable pageable, boolean isDeleted);
    Page<Stacks> findAllByWarehouse_WarehouseId(Pageable pageable, String warehouseId);
    Optional<Stacks> findByStackNameAndWarehouse_WarehouseId(String stackName,String warehouseId);
    boolean existsByStackNameAndWarehouse_WarehouseId(String stackName,String warehouseId);
}
