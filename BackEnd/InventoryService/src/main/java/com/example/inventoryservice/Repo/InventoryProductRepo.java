package com.example.inventoryservice.Repo;

import com.example.inventoryservice.Module.InventoryProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryProductRepo extends JpaRepository<InventoryProduct, String>, JpaSpecificationExecutor<InventoryProduct> {

    // Tìm theo warehouse và trạng thái xóa
    Page<InventoryProduct> findAllByWarehouseAndIsDeleted(String warehouse, Boolean isDeleted, Pageable pageable);

    // Tìm theo product và warehouse
    Optional<InventoryProduct> findByProductAndWarehouseAndIsDeleted(String product, String warehouse, Boolean isDeleted);

    // Kiểm tra tồn tại
    Boolean existsByProductAndWarehouseAndIsDeleted(String product, String warehouse, Boolean isDeleted);

    // Tìm các sản phẩm có tồn kho thấp hơn mức tối thiểu
    @Query("SELECT ip FROM InventoryProduct ip WHERE ip.totalQuantity < ip.minStockLevel AND ip.isDeleted = false")
    List<InventoryProduct> findLowStockProducts();

    // Tìm theo trạng thái
    Page<InventoryProduct> findAllByStatusAndIsDeleted(String status, Boolean isDeleted, Pageable pageable);

    // Đếm số lượng sản phẩm theo warehouse
    Integer countByWarehouseAndIsDeleted(String warehouse, Boolean isDeleted);
}
