package com.example.order.Module;

import com.example.order.Enum.ExportOrderStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExportOrder extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của export order'")
    String exportOrderId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID warehouse'", nullable = false)
    String warehouse;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID người tạo đơn'", nullable = false)
    String createByUser;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID khách hàng'")
    String customer;

    @Column(columnDefinition = "TEXT COMMENT 'Mô tả đơn xuất hàng'")
    String description;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày giao hàng dự kiến'")
    LocalDateTime deliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái đơn xuất hàng'", nullable = false)
    ExportOrderStatus status = ExportOrderStatus.CREATED;

    @Column(columnDefinition = "DECIMAL(18,2) COMMENT 'Tổng giá trị đơn hàng'")
    BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID người phê duyệt'")
    String approvedBy;

    @Column(columnDefinition = "DATETIME COMMENT 'Ngày phê duyệt'")
    LocalDateTime approvedDate;

    @OneToMany(mappedBy = "exportOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ExportItem> exportItems;
}
