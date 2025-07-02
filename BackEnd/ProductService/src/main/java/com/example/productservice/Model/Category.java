package com.example.productservice.Model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String categoryId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Ten cua the loai'", nullable = false)
    String categoryName;
    @Column(columnDefinition = "TEXT COMMENT 'Mo ta the loai'", nullable = false)
    String description;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse của từng category'",nullable = false)
    String warehouses;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của user đã tạo'",nullable = false)
    String createByUser;
    @OneToMany(mappedBy="category")
    List<Product> products;
}
