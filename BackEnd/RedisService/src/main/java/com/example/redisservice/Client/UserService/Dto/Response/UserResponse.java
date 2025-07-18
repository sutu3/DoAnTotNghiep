package com.example.redisservice.Client.UserService.Dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserResponse {
    String userId;
    String userName;
    String fullName;
    String email;
    String urlImage;
    String phoneNumber;
}
