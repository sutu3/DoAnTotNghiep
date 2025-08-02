package com.example.userservice.Dto.Responses.TaskUser;

import com.example.userservice.Dto.Responses.Task.TaskResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Enum.StatusTaskUserEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskUserResponseNoList{
    String id;
    String evidenceImages;
    StatusTaskUserEnum status;
    String note;
    LocalDateTime completeAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isDeleted;
    LocalDateTime deletedAt;
}
