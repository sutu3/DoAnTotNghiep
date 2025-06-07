package com.example.userservice.Form;

import lombok.Builder;

@Builder
public record TaskTypeForm(
        String taskName,
        String description

) {
}
