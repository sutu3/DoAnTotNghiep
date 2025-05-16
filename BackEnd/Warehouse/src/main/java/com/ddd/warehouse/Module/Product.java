package com.ddd.warehouse.Module;

import com.ddd.warehouse.Enum.Userenum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String productId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'ma sku của san pham'", unique = true,nullable = false)
    String skuCode;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên cua san pham'", nullable = false)
    String productName;
    @Column(precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) COMMENT 'gia cua san pham'",nullable = false)
    BigDecimal productPrice;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'url của san pham'", nullable = false)
    String urlImage;
    @Column(columnDefinition = "TEXT COMMENT 'mo ta của san pham'", nullable = false)
    String description;
    @ManyToOne
    @JoinColumn(name = "categoryId",nullable = false)
    Category category;
    // thiếu warehouseId
    //thiếu roleId
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    LocalDateTime createdAt;
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @UpdateTimestamp
    LocalDateTime updatedAt;
    @Column(columnDefinition = "boolean COMMENT 'flat coi tài xế da khong chay nua'", nullable = false)
    Boolean isDeleted;
    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian khong chay nua'", nullable = false)
    LocalDateTime deletedAt;
}
