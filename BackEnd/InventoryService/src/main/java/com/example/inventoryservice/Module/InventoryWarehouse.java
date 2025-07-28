package com.example.inventoryservice.Module;

import com.example.inventoryservice.Enum.WarehouseItemStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryWarehouse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của tồn kho warehouse'")
    String inventoryWarehouseId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID sản phẩm'", nullable = false)
    String product;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID warehouse'", nullable = false)
    String warehouse;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID bin chứa hàng'", nullable = false)
    String bin;

    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'Số lượng tại vị trí này'", nullable = false)
    BigDecimal quantity= BigDecimal.valueOf(0);

    @Column(columnDefinition = "DATE COMMENT 'Ngày hết hạn'")
    LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái (AVAILABLE, RESERVED, EXPIRED, DAMAGED, QUARANTINE)'")
    WarehouseItemStatus status = WarehouseItemStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventoryProductId", nullable = false)
    InventoryProduct inventoryProduct;

    // Unique constraint để đảm bảo mỗi bin chỉ chứa 1 loại sản phẩm với 1 expiry date
    @Table(uniqueConstraints = {
            @UniqueConstraint(columnNames = {"product", "bin", "expiryDate"})
    })
    public static class TableConstraints {}
}
