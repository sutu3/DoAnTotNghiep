package com.example.inventoryservice.Module;

import com.example.inventoryservice.Enum.CheckSheetStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckSheet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID duy nhất của phiếu kiểm kho'")
    String checkSheetId;

    @Column(columnDefinition = "VARCHAR(50) UNIQUE COMMENT 'Mã phiếu kiểm kho'", nullable = false)
    String checkSheetNumber;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'ID kho được kiểm'", nullable = false)
    String warehouse;

    @Column(columnDefinition = "VARCHAR(36) COMMENT 'Người thực hiện kiểm kho'", nullable = false)
    String performedBy;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian kiểm kho'", nullable = false)
    LocalDateTime checkDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) COMMENT 'Trạng thái phiếu kiểm (DRAFT, COMPLETED, APPROVED)'", nullable = false)
    CheckSheetStatus status = CheckSheetStatus.DRAFT;

    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú kiểm kho'")
    String notes;

    @Column(columnDefinition = "VARCHAR(500) COMMENT 'Đường dẫn file đính kèm (nếu có)'")
    String attachmentUrl;

    // Một phiếu kiểm kho có thể liên kết nhiều warehouse item được kiểm
    @OneToMany(mappedBy = "checkSheet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<InventoryCheckDetail> checkDetails;
}
