package com.example.userservice.Model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@SuperBuilder  // Thay @Builder bằng @SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskType extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String taskTypeId;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên của nhiệm vụ'", nullable = false,unique = true)
    String taskName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mô tả nhiệm vụ'", nullable = false)
    String description;
    @OneToMany(mappedBy="taskType")
    List<Tasks> tasks;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse chi tiết nhiệm vụ'",nullable = false)
    String warehouses;
}
