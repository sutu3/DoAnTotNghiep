package com.example.authenservice.Config;

import com.example.authenservice.Client.UserService.Dto.Response.UserResponse;
import com.example.authenservice.Client.UserService.Redis.UserController;
import com.example.authenservice.Client.UserService.UserClient;
import com.example.authenservice.Enum.RoleEnum;
import com.example.authenservice.Modal.Role;
import com.example.authenservice.Modal.User;
import com.example.authenservice.Repo.RoleRepo;
import com.example.authenservice.Repo.UserRepo;
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
import java.util.stream.Collectors;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    UserClient userClient;
    @Bean
    ApplicationRunner applicationRunner(UserRepo userRepository, RoleRepo roleRepository){
        return args -> {
            // Initial data setup
            if(userRepository.findByUsername("admin").isEmpty()) {

                Role roleStaff = roleRepository.save(Role.builder()
                        .roleName(RoleEnum.STAFF.name())
                        .description("Staff role has permissions for: Execute warehouse tasks, Create import/export requests, View assigned tasks, Update task status")
                        .isDeleted(false)
                        .build());

                Role roleManager = roleRepository.save(Role.builder()
                        .roleName(RoleEnum.MANAGER.name())
                        .description("Manager role has permissions for: Manage users and warehouses, Approve import/export requests, Assign tasks to staff, View all reports and analytics")
                        .isDeleted(false)
                        .build());
                UserResponse userResponse = userClient.getByEmail("admin@gmail.com").getResult();
                HashSet<Role> roles=new HashSet<Role>();
                roles.add(roleManager);
                roles.add(roleStaff);
                User user=User.builder()
                        .username(userResponse.getUserName())
                        .password(passwordEncoder.encode("admin"))
                        .createdAt(LocalDateTime.now())
                        .roles(roles)
                        .idUser(userResponse.getUserId())
                        .email(userResponse.getEmail())
                        .isDeleted(false)
                        .build();
                userRepository.save(user);
            }

            log.warn("user admin created with default password username is admin");
        };
    }
}
