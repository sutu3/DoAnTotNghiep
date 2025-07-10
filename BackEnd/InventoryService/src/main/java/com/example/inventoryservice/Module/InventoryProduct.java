package com.example.inventoryservice.Module;

import com.example.inventoryservice.Enum.InventoryStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryProduct extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của inventory product'")
    String inventoryProductId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID sản phẩm'", nullable = false)
    String product;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID warehouse'", nullable = false)
    String warehouse;

    @Column(columnDefinition = "INT COMMENT 'Tổng số lượng tồn kho'", nullable = false)
    Integer totalQuantity = 0;

    @Column(columnDefinition = "INT COMMENT 'Mức tồn kho tối thiểu'")
    Integer minStockLevel = 0;

    @Column(columnDefinition = "INT COMMENT 'Mức tồn kho tối đa'")
    Integer maxStockLevel = 0;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày nhập gần nhất'")
    LocalDateTime lastImportDate;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày xuất gần nhất'")
    LocalDateTime lastExportDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái (ACTIVE, INACTIVE, DISCONTINUED)'")
    InventoryStatus status = InventoryStatus.ACTIVE;

    @OneToMany(mappedBy = "inventoryProduct", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<InventoryWarehouse> inventoryWarehouses;

    // Unique constraint để đảm bảo mỗi product chỉ có 1 record trong 1 warehouse
    @Table(uniqueConstraints = {
            @UniqueConstraint(columnNames = {"product", "warehouse"})
    })
    public static class TableConstraints {}
}
