package com.example.userservice.Form;

import lombok.Builder;

@Builder
public record UserForm(    
        String userName,
        String fullName,
        String urlImage,
        String phoneNumber,
        String gender,
        String homeAddress,
        String dateOfBirth,
        String email) {
}
