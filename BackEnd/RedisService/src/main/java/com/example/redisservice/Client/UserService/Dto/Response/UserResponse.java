package com.example.redisservice.Client.UserService.Dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userId;
    String userName;
    String fullName;
    String email;
    String urlImage;
    String phoneNumber;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
