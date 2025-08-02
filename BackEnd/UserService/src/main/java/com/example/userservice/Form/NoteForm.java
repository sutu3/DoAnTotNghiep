package com.example.userservice.Form;

import lombok.Builder;

@Builder
public record NoteForm(
        String note
) {
}
