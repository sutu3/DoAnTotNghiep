package com.example.userservice.Client.Authen.Dto.Request;

import lombok.Builder;

@Builder
public record UserRequestAuthen(
        String username,
        String password,
        String email,
        String idUser
) {
}
