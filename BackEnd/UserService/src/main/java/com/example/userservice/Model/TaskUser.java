package com.example.userservice.Model;


import com.example.userservice.Enum.StatusTaskEnum;
import com.example.userservice.Enum.StatusTaskUserEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.scheduling.config.Task;

import java.time.LocalDateTime;

@Entity
@SuperBuilder  // Thay @Builder bằng @SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskUser extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @ManyToOne
    @JoinColumn(name = "taskId",nullable = false)
    Tasks task;
    @ManyToOne
    @JoinColumn(name = "userId",nullable = false)
    Users user;
    @Column(columnDefinition = "TEXT COMMENT 'Danh sách ảnh minh chứng'")
    String evidenceImages;
    @Enumerated(EnumType.STRING)
    StatusTaskUserEnum status;
    @Column(columnDefinition = "TEXT COMMENT 'Ghi chú nhiệm vụ'")
    String note;
    @Column(columnDefinition = "DATETIME COMMENT 'Thời gian phải hoàng tất nhiệm vụ'",nullable = false)
    LocalDateTime completeAt;
}
