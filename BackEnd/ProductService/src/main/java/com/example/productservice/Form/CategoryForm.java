package com.example.productservice.Form;

import lombok.Builder;

@Builder
public record CategoryForm(
        String categoryName,
        String description
) {
}
