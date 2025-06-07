package com.example.userservice.Model;

import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Tasks extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String taskId;
    @ManyToOne
    @JoinColumn(name = "taskTypeId",nullable = false)
    TaskType taskType;
    @Enumerated(EnumType.STRING)
    StatusTaskEnum status;
    @Enumerated(EnumType.STRING)
    LevelEnum level;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mô tả nhiệm vụ'")
    String description;
    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian hoàng tất nhiệm vụ'")
    LocalDateTime completeAt;
}
