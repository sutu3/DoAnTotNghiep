package com.example.userservice.Dto.Request;

import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TaskUserRequest(
                String task,
                String user,
                String note,
                LocalDateTime completeAt
) {
}
