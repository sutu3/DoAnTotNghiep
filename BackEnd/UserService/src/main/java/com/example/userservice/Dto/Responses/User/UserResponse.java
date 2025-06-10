package com.example.userservice.Dto.Responses.User;

import com.example.userservice.Dto.Responses.TaskUser.TaskUserResponseNoList;
import com.example.userservice.Enum.StatusEnum;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
        String userId,
        String userName,
        String fullName,
        String email,
        String urlImage,
        String phoneNumber,
        StatusEnum status,
        List<TaskUserResponseNoList> taskUsers,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
