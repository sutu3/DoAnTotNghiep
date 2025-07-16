package com.example.authenservice.Dtos.Request;

import lombok.Builder;

@Builder
public record LogoutRequest(
        String token
) {
}
