package com.example.order.Module;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã item xuất kho (UUID)'")
    String deliveryItemId;

    @ManyToOne
    @JoinColumn(name = "deliveryId", nullable = false)
    WarehouseDelivery warehouseDelivery;

    @ManyToOne
    @JoinColumn(name = "exportItemId", nullable = false)
    ExportItem exportItem;

    @Column(columnDefinition = "DECIMAL(10,3) COMMENT 'Số lượng thực xuất'", nullable = false)
    BigDecimal deliveredQuantity;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Vị trí bin'")
    String binLocation;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian xuất'")
    LocalDateTime deliveredAt;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú item'")
    String note;
}
