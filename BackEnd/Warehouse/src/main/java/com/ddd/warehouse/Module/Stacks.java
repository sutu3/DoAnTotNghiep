package com.ddd.warehouse.Module;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "STACK_NAME_REQUIRED")
    @Size(min = 2, max = 50, message = "STACK_NAME_SIZE")
    @Column(columnDefinition = "VARCHAR(50) COMMENT 'Tên dãy hàng'", nullable = false)
    String stackName;
    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    @Column(columnDefinition = "TEXT COMMENT 'Mô tả dãy hàng'")
    String description;

    @NotNull(message = "Warehouse không được null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouseId")
    Warehouses warehouse;
    @OneToMany(mappedBy="stack")
    List<Bins> bin;

}
