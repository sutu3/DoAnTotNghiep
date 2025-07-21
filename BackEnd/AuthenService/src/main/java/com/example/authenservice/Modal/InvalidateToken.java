package com.example.authenservice.Modal;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidateToken {
    @Id
    String id;
    @Column(columnDefinition = "DATE  COMMENT 'thời gian hết hạn'",nullable = false,unique = true)
    Date expiryTime;
}
