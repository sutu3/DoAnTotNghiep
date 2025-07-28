package com.ddd.warehouse.Module;

import com.ddd.warehouse.Enum.BinStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

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
    @NotBlank(message = "Mã bin không được để trống")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Mã bin chỉ được chứa chữ hoa, số và dấu gạch ngang")
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'Mã bin'", nullable = false)
    String binCode;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái của bin'", nullable = false)
    @NotNull(message = "Trạng thái bin không được null")
    BinStatus status;

    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'sức chứa của bin'", nullable = false)
    @DecimalMin(value = "0.000001", message = "BIN_CAPACITY_INVALID")
    @DecimalMax(value = "10000.000000", message = "BIN_CAPACITY_INVALID")
    BigDecimal capacity;

    @DecimalMin(value = "0.000000", message = "Số lượng hiện tại không được âm")
    @Column(columnDefinition = "DECIMAL(15,6) COMMENT 'số lượng hiện tại'", nullable = false)
    BigDecimal currentOccupancy = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "stackId",nullable = false)
    Stacks stack;
    @ManyToOne
    @JoinColumn(name = "warehouseId",nullable = false)
    Warehouses warehouse;

}
