package com.example.inventoryservice.Repo;

import com.example.inventoryservice.Enum.WarehouseItemStatus;
import com.example.inventoryservice.Module.InventoryWarehouse;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryWarehouseRepo extends JpaRepository<InventoryWarehouse, String>, JpaSpecificationExecutor<InventoryWarehouse> {

    // Tìm theo bin và trạng thái xóa
    List<InventoryWarehouse> findAllByBinAndIsDeleted(String bin, Boolean isDeleted);
    List<InventoryWarehouse> findAllByProductAndIsDeleted(String product, Boolean isDeleted);

    // Tìm theo product và bin
    Optional<InventoryWarehouse> findByProductAndBinAndIsDeleted(String product, String bin, Boolean isDeleted);

    // Tìm theo product và bin với expiry date
    Optional<InventoryWarehouse> findByProductAndBinAndExpiryDateAndIsDeleted(
            String product, String bin, LocalDate expiryDate, Boolean isDeleted);

    // Tìm theo warehouse
    Page<InventoryWarehouse> findAllByWarehouseAndIsDeleted(String warehouse, Boolean isDeleted, Pageable pageable);

    // Tìm theo inventory product
    List<InventoryWarehouse> findAllByInventoryProduct_InventoryProductIdAndIsDeleted(String inventoryProductId, Boolean isDeleted);

    // Tìm theo trạng thái
    List<InventoryWarehouse> findAllByStatusAndIsDeleted(WarehouseItemStatus status, Boolean isDeleted);

    // Tìm sản phẩm sắp hết hạn
    @Query("SELECT iw FROM InventoryWarehouse iw WHERE iw.expiryDate <= :date AND iw.isDeleted = false")
    List<InventoryWarehouse> findExpiringProducts(@Param("date") LocalDate date);

    // Tính tổng số lượng theo product và warehouse
    @Query("SELECT COALESCE(SUM(iw.quantity), 0) FROM InventoryWarehouse iw WHERE iw.product = :product AND iw.warehouse = :warehouse AND iw.isDeleted = false")
    Integer sumQuantityByProductAndWarehouse(@Param("product") String product, @Param("warehouse") String warehouse);

    // Kiểm tra bin có trống không
    @Query("SELECT CASE WHEN COUNT(iw) > 0 THEN false ELSE true END FROM InventoryWarehouse iw WHERE iw.bin = :bin AND iw.quantity > 0 AND iw.isDeleted = false")
    Boolean isBinEmpty(@Param("bin") String bin);
}
