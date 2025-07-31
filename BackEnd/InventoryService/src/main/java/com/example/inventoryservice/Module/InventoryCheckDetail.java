package com.example.inventoryservice.Module;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID chi tiết phiếu kiểm kho'")
    String checkDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "check_sheet_id", nullable = false, columnDefinition = "VARCHAR(36) COMMENT 'ID phiếu kiểm kho'")
    InventoryCheckSheet checkSheet;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID dòng sản phẩm trong kho được kiểm'", nullable = false)
    String inventoryWarehouseId;

    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'Số lượng theo hệ thống'", nullable = false)
    BigDecimal systemQuantity;

    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'Số lượng thực tế kiểm đếm'", nullable = false)
    BigDecimal actualQuantity;

    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'Chênh lệch giữa thực tế và hệ thống'", nullable = false)
    BigDecimal difference;

    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Lý do điều chỉnh (nếu có)'")
    String adjustmentReason;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú chi tiết'")
    String notes;
}
