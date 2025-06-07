package com.example.userservice.Dto.Responses.User;

import com.example.userservice.Enum.StatusEnum;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

public record UserResponse(
        String userId,
        String userName,
        String fullName,
        String email,
        String urlImage,
        String phoneNumber,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Boolean isDeleted,
        LocalDateTime deletedAt
) {
}
