package com.example.productservice.Model;

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
public class Product extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String productId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Tên của sản phẩm'", nullable = false)
    String productName;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Mã sản phẩm'", nullable = false,unique = true)
    String sku;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Mô ta cua sản phẩm'", nullable = false)
    String description;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Ảnh sản phâm'")
    String urlImageProduct;
    @Column(columnDefinition = "DECIMAL(10,2) COMMENT 'Giá của sản phẩm'", nullable = false)
    BigDecimal price;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Mã nhà cung cấp'")
    String supplier;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của user đã tạo'",nullable = false)
    String createByUser;
    @Column(columnDefinition = "BOOLEAN COMMENT 'Trạng thái còn bán của sản phẩm'", nullable = false)
    Boolean IsActive;
    @ManyToOne
    @JoinColumn(name = "categoryId",nullable = false)
    Category category;
    @ManyToOne
    @JoinColumn(name = "unitId",nullable = false)
    Unit unit;
}
