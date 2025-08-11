package com.example.authenservice.Dtos.Request;

public record ResetPasswordRequest(
        String userId,
        String newPassword
) {
}
