package com.example.userservice.Model;

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
public class AddressEntity  extends BaseEntity{
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'địa chỉ của người dùng'",nullable = false)
    String address;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'quận'",nullable = false)
    String district;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'tên đường'",nullable = false)
    String street;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'tên thành phố'",nullable = false)
    String country;
}
