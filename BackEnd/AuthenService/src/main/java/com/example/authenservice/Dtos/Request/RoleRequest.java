package com.example.authenservice.Dtos.Request;

import jakarta.persistence.Column;
import lombok.Builder;

@Builder
public record RoleRequest(
        String roleName,
        String description
) {
}
