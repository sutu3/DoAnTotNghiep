package com.ddd.warehouse.Module;

import com.ddd.warehouse.Enum.Userenum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String categoryId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'tên danh mục của sản phẩm'", nullable = false)
    String categoryName;
    @Column(columnDefinition = "TEXT COMMENT 'mô tả danh mục của sản phẩm'", nullable = false)
    String description;
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
