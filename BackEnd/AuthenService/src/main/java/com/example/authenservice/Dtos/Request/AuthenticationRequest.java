package com.example.authenservice.Dtos.Request;

import lombok.Builder;

@Builder
public record AuthenticationRequest(
        String email,
        String password ) {
}
