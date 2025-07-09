package com.example.order.Module;

import com.example.order.Enum.OrderStatus;
import com.example.order.Enum.OrderType;
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
public class ImportOrder extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã đơn nhập (UUID)'")
    String importOrderId;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Mã kho liên quan đến đơn nhập'", nullable = false)
    String warehouse;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái đơn nhập: Created, InProgress, Done, Cancel'", nullable = false)
    OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Loại đơn: Request hoặc Accept'", nullable = false)
    OrderType type;

    @Column(columnDefinition = "VARCHAR(50) COMMENT 'Người tạo đơn nhập'", nullable = false)
    String createByUser;

    @Column(columnDefinition = "VARCHAR(50) COMMENT 'Quản trị viên xử lý đơn'")
    String accessByAdmin;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú cho đơn nhập'")
    String note;

    @Column(columnDefinition = "DECIMAL(10,2) COMMENT 'tổng giá đơn hàng'")
    BigDecimal totalPrice;

    @Column(columnDefinition = "VARCHAR(255) COMMENT 'URL hình ảnh kiểm tra đơn nhập'")
    String imageCheckUrl;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian yêu cầu đơn nhập'")
    LocalDateTime requestDate;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian duyệt đơn nhập'")
    LocalDateTime accessDate;
    @OneToMany(mappedBy="importOrder")
    List<ImportItem> importItems;
}
