package com.example.userservice.Model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
