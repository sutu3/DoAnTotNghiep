package com.example.inventoryservice.Module;

import com.example.inventoryservice.Enum.MovementType;
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
public class StockMovement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của stock movement'")
    String movementId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID inventory warehouse'", nullable = false)
    String inventoryWarehouseId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID sản phẩm'", nullable = false)
    String product;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Loại di chuyển (IMPORT, EXPORT, TRANSFER, ADJUSTMENT)'", nullable = false)
    MovementType movementType;

    @Column(columnDefinition = "INT COMMENT 'Số lượng di chuyển'", nullable = false)
    Integer quantity;

    @Column(columnDefinition = "INT COMMENT 'Số lượng trước khi di chuyển'")
    Integer quantityBefore;

    @Column(columnDefinition = "INT COMMENT 'Số lượng sau khi di chuyển'")
    Integer quantityAfter;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID đơn hàng tham chiếu'")
    String referenceOrderId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID người thực hiện'")
    String performedBy;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú'")
    String note;

    @Column(columnDefinition = "DECIMAL(10,2) COMMENT 'Giá trị đơn vị'")
    BigDecimal unitCost;
}
