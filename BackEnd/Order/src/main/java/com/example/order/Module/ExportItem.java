package com.example.order.Module;

import com.example.order.Enum.ExportItemStatus;
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
public class ExportItem  extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của export item'")
    String exportItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exportOrderId", nullable = false)
    ExportOrder exportOrder;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID sản phẩm'", nullable = false)
    String product;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID đơn vị tính'", nullable = false)
    String unit;

    @Column(columnDefinition = "INT COMMENT 'Số lượng xuất'", nullable = false)
    Integer quantity;

    @Column(columnDefinition = "DECIMAL(15,2) COMMENT 'Đơn giá'", nullable = false)
    BigDecimal unitPrice;

    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Vị trí bin'")
    String binLocation;

    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Số lô hàng'")
    String batchNumber;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái item'", nullable = false)
    ExportItemStatus status = ExportItemStatus.PENDING;
}
