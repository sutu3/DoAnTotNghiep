package com.ddd.warehouse.Module;

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
public class Warehouses extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String warehouseId;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên của kho'", nullable = false)
    String warehouseName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'địa chỉ của kho'", nullable = false)
    String address;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên đường của kho'", nullable = false)
    String street;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'quận/huyện của kho'", nullable = false)
    String district;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'thành phố/ tỉnh của kho'", nullable = false)
    String country;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Mã người quản lý'", nullable = false)
    String managerId;
    @OneToMany(mappedBy="warehouse")
    List<Stacks> stacks;
}
