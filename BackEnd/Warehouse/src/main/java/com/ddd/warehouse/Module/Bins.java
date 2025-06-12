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
public class Bins extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String binId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'mã code của bin'", nullable = false)
    String binCode;
    @Column(columnDefinition = "INTEGER COMMENT 'sức chưa của bin'", nullable = false)
    Integer capacity;
    @ManyToOne
    @JoinColumn(name = "stackId",nullable = false)
    Stacks stack;
    @ManyToOne
    @JoinColumn(name = "warehouseId",nullable = false)
    Warehouses warehouse;

}
