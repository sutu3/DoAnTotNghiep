package com.example.userservice.Model;

import com.example.userservice.Enum.LevelEnum;
import com.example.userservice.Enum.StatusEnum;
import com.example.userservice.Enum.StatusTaskEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@SuperBuilder  // Thay @Builder bằng @SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Tasks extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String taskId;
    @ManyToOne
    @JoinColumn(name = "taskTypeId",nullable = false)
    TaskType taskType;
    @OneToMany(mappedBy="task")
    List<TaskUser> taskUsers;
    @Enumerated(EnumType.STRING)
    StatusTaskEnum status;
    @Enumerated(EnumType.STRING)
    LevelEnum level;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse của từng nhiệm vụ'",nullable = false)
    String warehouses;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mô tả nhiệm vụ'")
    String description;
    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian hoàng tất nhiệm vụ'")
    LocalDateTime completeAt;
}
