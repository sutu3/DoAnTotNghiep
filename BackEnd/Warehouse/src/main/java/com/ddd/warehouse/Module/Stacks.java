package com.ddd.warehouse.Module;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Stacks extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String stackId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'tên của dãy stack'", nullable = false,unique = true)
    String stackName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mô tả của dãy stack'")
    String description;
    @ManyToOne
    @JoinColumn(name = "warehouseId",nullable = false)
    Warehouses warehouse;

}
