package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Warehouses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BinRepo extends JpaRepository<Bins,String>, JpaSpecificationExecutor<Bins> {
    Page<Bins> findAllByIsDeleted(Pageable pageable, boolean isDeleted);
    Page<Bins> findAllByWarehouse_WarehouseId(Pageable pageable, String warehouseId);
    List<Bins> findAllByWarehouse_WarehouseIdAndIsDeleted(String warehouseId, boolean isDeleted);
    Page<Bins> findAllByStack_StackName(Pageable pageable, String stackName);
    Optional<Bins> findByBinCodeAndStack_StackNameAndWarehouse_WarehouseId(String binCode, String stackStackName,String  warehouseId);
    boolean existsByBinCodeAndStack_StackNameAndWarehouse_WarehouseId(String binCode, String stackStackName,String  warehouseId);
    List<Bins> findAllByWarehouse_WarehouseIdAndIsDeleted(String warehouse, Boolean isDeleted);
    List<Bins> findByStack_StackIdAndIsDeleted(String stackId, Boolean isDeleted);


}
