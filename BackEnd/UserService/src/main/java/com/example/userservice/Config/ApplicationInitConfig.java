package com.example.userservice.Config;


import com.example.userservice.Enum.StatusEnum;
import com.example.userservice.Model.Users;
import com.example.userservice.Repo.UserRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    @Bean
    ApplicationRunner applicationRunner(UserRepo userRepository){
        return args -> {
            // Initial data setup
            if(userRepository.findByUserName("admin").isEmpty()) {
                Users user=Users.builder()
                        .userName("admin")
                        .createdAt(LocalDateTime.now())
                        .email("admin@gmail.com")
                        .phoneNumber("123456789")
                        .isDeleted(false)
                        .status(StatusEnum.Active)
                        .build();
                userRepository.save(user);
            }

            log.warn("user admin created with default password username is admin");
        };
    }
}
