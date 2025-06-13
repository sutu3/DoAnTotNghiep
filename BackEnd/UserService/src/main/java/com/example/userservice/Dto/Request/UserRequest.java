package com.example.userservice.Dto.Request;

import jakarta.persistence.Column;
import lombok.Builder;

@Builder
public record UserRequest(
        String userName,
        String fullName,
        String email,
        String urlImage,
        String phoneNumber,
        String warehouses
) {
}
