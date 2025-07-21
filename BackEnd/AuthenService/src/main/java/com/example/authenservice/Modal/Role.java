package com.example.authenservice.Modal;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role extends BaseEntity {
    @Id
    @Column(columnDefinition = "VARCHAR(100)  COMMENT 'tên vai trò'",nullable = false)
    String roleName;
    @Column(columnDefinition = "TEXT  COMMENT 'mô tả vai trò'",nullable = false)
    String description;
}
