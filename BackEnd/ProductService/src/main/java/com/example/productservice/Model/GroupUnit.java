package com.example.productservice.Model;

import com.example.productservice.Enum.UnitType;
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
public class GroupUnit extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String groupUnitID;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Ten cua group đơn vị'", nullable = false)
    String groupName;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'Mô ta cua group đơn vị'", nullable = false)
    String description;
    @Column(columnDefinition = "Float COMMENT 'Tỷ lệ quy đổi'", nullable = false)
    Float baseUnitRatio;
    @Enumerated(EnumType.STRING)
    UnitType unitType;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của user đã tạo'",nullable = false)
    String createByUser;
    @OneToMany(mappedBy="groupUnit")
    List<Unit> units;
}
