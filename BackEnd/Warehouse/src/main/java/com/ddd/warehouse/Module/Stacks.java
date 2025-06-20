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
public class Stacks extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String stackId;
    @Column(columnDefinition = "VARCHAR(100) COMMENT 'tên của dãy stack'", nullable = false)
    String stackName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mô tả của dãy stack'")
    String description;
    @OneToMany(mappedBy="stack")
    List<Bins> bin;
    @ManyToOne
    @JoinColumn(name = "warehouseId",nullable = false)
    Warehouses warehouse;

}
