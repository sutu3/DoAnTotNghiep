package com.example.userservice.Model;

import com.example.userservice.Enum.StatusSupplier;
import com.example.userservice.Enum.StatusTaskEnum;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder  // Thay @Builder bằng @SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Supplier extends AddressEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String supplierId;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Ảnh của người dùng'",nullable = false)
    String urlSupplier;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Tên của người dùng'",nullable = false)
    String supplierName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Email của người dùng'",nullable = false)
    String email;
    @Enumerated(EnumType.STRING)
    StatusSupplier status;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Điện thoại của người dùng'",nullable = false)
    String phoneNumber;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse'",nullable = false)
    String warehouses;


}
