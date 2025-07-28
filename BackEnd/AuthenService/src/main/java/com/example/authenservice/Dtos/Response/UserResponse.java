package com.example.authenservice.Dtos.Response;

import com.example.authenservice.Modal.BaseEntity;
import com.example.authenservice.Modal.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String idUser;
    String username;
    String email;
    Set<RoleResponse> roles;
}
