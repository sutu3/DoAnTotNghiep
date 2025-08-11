package com.example.order.Module;


import com.example.order.Enum.DeliveryStatus;
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
public class WarehouseDelivery extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã phiếu xuất kho (UUID)'")
    String deliveryId;

    @ManyToOne
    @JoinColumn(name = "exportOrderId", nullable = false)
    ExportOrder exportOrder;

    @Column(columnDefinition = "VARCHAR(50) COMMENT 'Người tạo phiếu xuất kho'", nullable = false)
    String createdByUser;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày xuất hàng'")
    LocalDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái: PENDING, IN_PROGRESS, COMPLETED'")
    DeliveryStatus status;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú phiếu xuất kho'")
    String notes;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã kho liên quan đến đơn xuất'", nullable = false)
    String warehouse;

    @OneToMany(mappedBy = "warehouseDelivery", cascade = CascadeType.ALL)
    List<DeliveryItem> deliveryItems;
}
