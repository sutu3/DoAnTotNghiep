package com.example.userservice.Dto.Request;


import lombok.Builder;

@Builder
public record StatusRequest(
        String status
) {
}
