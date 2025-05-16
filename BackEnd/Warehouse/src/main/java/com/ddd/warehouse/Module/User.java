package com.ddd.warehouse.Module;

import com.ddd.warehouse.Enum.Userenum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên của user'", nullable = false)
    String userName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên đầy đủ của user'", nullable = false)
    String fullName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'email của user'", nullable = false,unique = true)
    String email;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'url của user'", nullable = false)
    String urlImage;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'password của user'", nullable = false)
    String password;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'số điện thoại của user'", nullable = false,unique = true)
    String phoneNumber;
    @Enumerated(EnumType.STRING)
    Userenum status;
    // thiếu warehouseId
    //thiếu roleId
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    LocalDateTime createdAt;
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @UpdateTimestamp
    LocalDateTime updatedAt;
    @Column(columnDefinition = "boolean COMMENT 'flat coi tài xế da khong chay nua'", nullable = false)
    Boolean isDeleted;
    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian khong chay nua'", nullable = false)
    LocalDateTime deletedAt;
}
