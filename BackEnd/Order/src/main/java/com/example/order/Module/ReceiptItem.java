package com.example.order.Module;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã item nhập kho (UUID)'")
    String receiptItemId;

    @ManyToOne
    @JoinColumn(name = "receiptId", nullable = false)
    WarehouseReceipt warehouseReceipt;

    @ManyToOne
    @JoinColumn(name = "importItemId", nullable = false)
    ImportItem importItem;

    @Column(columnDefinition = "INT COMMENT 'Số lượng thực nhận'", nullable = false)
    Integer receivedQuantity;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Vị trí bin'")
    String binLocation;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian nhập'")
    LocalDateTime receivedAt;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú item'")
    String note;
}
