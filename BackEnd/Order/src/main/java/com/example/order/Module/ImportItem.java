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
public class ImportItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String itemId;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã sản phẩm'",nullable = false)
    String product;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã kho quản lý'",nullable = false)
    String warehouse;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã nhà cung cấp'",nullable = false)
    String supplier;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã loại đơn vị'",nullable = false)
    String unit;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã bin đựng'")
    String bin;
    @Column(columnDefinition = "DATE COMMENT 'thời gian hết hạn'")
    LocalDateTime ExpiredDate;
    @Column(columnDefinition = "INTEGER COMMENT 'số lượng yêu cầu nhập'",nullable = false)
    int requestQuantity;
    @Column(columnDefinition = "TEXT COMMENT 'ghi chú sản phẩm nhập'")
    String note;
    @Column(columnDefinition = "INTEGER COMMENT 'số lượng nhập thực tế'")
    int realityQuantity;
    @Column(columnDefinition = "DECIMAL(10,2) COMMENT 'giá nhập'",nullable = false)
    BigDecimal costUnitBase ;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã người dùng tạo'",nullable = false)
    String createByUser;
    @Column(columnDefinition = "DATE COMMENT 'thời gian nhập sản phẩm'")
    LocalDateTime importAt;
    @ManyToOne
    @JoinColumn(name = "importOrderId",nullable = false)
    ImportOrder importOrder;
}
