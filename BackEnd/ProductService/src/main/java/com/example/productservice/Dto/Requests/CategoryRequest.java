package com.example.productservice.Dto.Requests;

import lombok.Builder;

@Builder
public record CategoryRequest(
        String categoryName,
        String description) {
}
