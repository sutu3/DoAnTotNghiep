package com.example.authenservice.Dtos.Request;

import lombok.Builder;

@Builder
public record UserRequest(
        String username,
        String password,
        String email,
        String idUser) {
}
