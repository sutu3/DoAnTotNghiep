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
public class Unit extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String unitID;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Tên của đơn vị quy đổi'", nullable = false)
    String unitName;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Tên rút gọn của đơn vị quy đổi'", nullable = false)
    String shortName;
    @Column(columnDefinition = "FLOAT COMMENT 'Tỷ lệ quy đổi về đơn vị chuẩn của nhóm '", nullable = false)
    Float ratioToBase;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Đánh dấu đơn vị này là mặc định trong nhóm'", nullable = false)
    Boolean isDefault;
    @OneToMany(mappedBy="unit")
    List<Product> products;
    @ManyToOne
    @JoinColumn(name = "groupUnitID",nullable = false)
    GroupUnit groupUnit;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của user đã tạo'",nullable = false)
    String createByUser;
}
