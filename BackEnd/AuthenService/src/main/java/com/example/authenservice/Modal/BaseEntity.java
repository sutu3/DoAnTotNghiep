package com.example.authenservice.Modal;


import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@SuperBuilder  // Sử dụng @SuperBuilder để hỗ trợ kế thừa Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public class BaseEntity {

    @CreationTimestamp
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false, updatable = true, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    LocalDateTime updatedAt;

    @Column(columnDefinition = "BOOL COMMENT 'flat coi entity co dung  nua'", nullable = false)
    Boolean isDeleted = false;

    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian xoa'", nullable = true)
    LocalDateTime deletedAt;
}
