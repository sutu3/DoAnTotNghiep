package com.example.authenservice.Dtos.Request;

import lombok.Builder;

@Builder
public record IntrospectRequest(
        String token
) {
}
