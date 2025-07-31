package com.example.inventoryservice.Repo;

import com.example.inventoryservice.Module.InventoryCheckDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InventoryCheckDetailRepo extends JpaRepository<InventoryCheckDetail, String>, JpaSpecificationExecutor<InventoryCheckDetail> {

    List<InventoryCheckDetail> findAllByCheckSheet_CheckSheetId(String checkSheetId);

    List<InventoryCheckDetail> findAllByInventoryWarehouseId(String inventoryWarehouseId);

    @Query("SELECT icd FROM InventoryCheckDetail icd WHERE icd.difference != 0 AND icd.checkSheet.checkSheetId = :checkSheetId")
    List<InventoryCheckDetail> findDiscrepanciesByCheckSheetId(@Param("checkSheetId") String checkSheetId);

    @Query("SELECT COALESCE(SUM(ABS(icd.difference)), 0) FROM InventoryCheckDetail icd WHERE icd.checkSheet.checkSheetId = :checkSheetId")
    BigDecimal getTotalDiscrepancyByCheckSheetId(@Param("checkSheetId") String checkSheetId);
}
