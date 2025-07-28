package com.example.order.Module;

import com.example.order.Enum.ReceiptStatus;
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
public class WarehouseReceipt extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã phiếu nhập kho (UUID)'")
    String receiptId;

    @ManyToOne
    @JoinColumn(name = "importOrderId", nullable = false)
    ImportOrder importOrder;

    @Column(columnDefinition = "VARCHAR(50) COMMENT 'Người tạo phiếu nhập kho'", nullable = false)
    String createdByUser;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày nhận hàng'")
    LocalDateTime receivedDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái: PENDING, PARTIAL, COMPLETED'")
    ReceiptStatus status;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú phiếu nhập kho'")
    String note;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã kho liên quan đến đơn nhập'", nullable = false)
    String warehouse;
    @OneToMany(mappedBy = "warehouseReceipt", cascade = CascadeType.ALL)
    List<ReceiptItem> receiptItems;
}