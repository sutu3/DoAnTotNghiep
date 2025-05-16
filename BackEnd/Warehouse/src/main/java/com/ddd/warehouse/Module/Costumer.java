package com.ddd.warehouse.Module;

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
public class Costumer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String costumerId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'tên của khach hang'", nullable = false)
    String costumerName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'url ảnh cua costumer'", nullable = false)
    String urlImage;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'email của  khach hang'",unique = true, nullable = false)
    String email;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'điện thoại của khach hang'",unique = true, nullable = false)
    String phoneNumber;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'địa chỉ của khach hang'", nullable = false)
    String address;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'đường của khach hang'", nullable = false)
    String street;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'quận/huyện của khach hang'", nullable = false)
    String district;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'thành pho của khach hang'", nullable = false)
    String country;
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
