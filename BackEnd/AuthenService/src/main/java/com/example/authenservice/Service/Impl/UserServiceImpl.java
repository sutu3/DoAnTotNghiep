package com.example.authenservice.Service.Impl;

import com.example.authenservice.Client.UserService.Redis.UserController;
import com.example.authenservice.Dtos.Request.NotificationForgotPassword;
import com.example.authenservice.Dtos.Request.UpdateRole;
import com.example.authenservice.Dtos.Request.UserRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Dtos.Response.UserResponse;
import com.example.authenservice.Exception.AppException;
import com.example.authenservice.Exception.ErrorCode;
import com.example.authenservice.Mapper.RoleMapper;
import com.example.authenservice.Mapper.UserMapper;
import com.example.authenservice.Modal.Role;
import com.example.authenservice.Modal.User;
import com.example.authenservice.Repo.RoleRepo;
import com.example.authenservice.Repo.UserRepo;
import com.example.authenservice.Service.JavaMailSenderService;
import com.example.authenservice.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserServiceImpl implements UserService {
    private final RoleMapper roleMapper;
    UserRepo userRepo;
    RoleRepo roleRepo;
    UserMapper userMapper;
    UserController userServiceClient; // Feign client để gọi UserService
    PasswordEncoder passwordEncoder;
    private final JavaMailSenderService javaMailSenderService;

    @Override
    @PreAuthorize("hasRole('MANAGER')")
    public UserResponse createUser(UserRequest request) {
        // Kiểm tra user đã tồn tại chưa
        if (userRepo.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXIST);
        }
        if (userRepo.existsById(request.idUser())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXIST);
        }
        // Tạo user trong AuthenService
        User user = User.builder()
                .username(request.username())
                .idUser(request.idUser())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .isDeleted(false)
                .roles(getDefaultRoles())
                .build();
        log.info(user.toString());
        try {
            User savedUser = userRepo.save(user);
            return userMapper.toResponse(savedUser);
        } catch (Exception e) {
            log.error("Error saving user: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public UserResponse getUserById(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Update fields
        user.setUsername(request.username());
        user.setEmail(request.email());

        if (request.password() != null && !request.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        User updatedUser = userRepo.save(user);

        // Sync update với UserService
        syncUpdateWithUserService(updatedUser, request);

        return userMapper.toResponse(updatedUser);
    }

    @Override
    public UserResponse updateUserRoleManager(String email, UpdateRole updateRole) {
        User user=userRepo.findByEmailWithRoles(email)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        Set<Role> roles=user.getRoles();
        Role role=roleRepo.findByRoleName("MANAGER")
                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
        if(updateRole.isManager()){
            roles.add(role);
        }else{
            roles.remove(role);
        }
        user.setRoles(roles);
        userRepo.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepo.findByIsDeleted(pageable,false)
                .map(userMapper::toResponse);
    }

    @Override
    public Set<RoleResponse> getRolesByUserId(String userId) {
        User user=userRepo.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getRoles().stream().map(roleMapper::toResponse).collect(Collectors.toSet());
    }

    @Override
    public List<UserResponse> getAllUserManager() {
        Role role=roleRepo.findByRoleName("MANAGER")
                .orElseThrow(()->new AppException(ErrorCode.ROLE_NOT_FOUND));
        List<User> users=userRepo.findAllByRolesAndIsDeleted(role,false);
        return List.of();
    }



    private void syncUpdateWithUserService(User authUser, UserRequest request) {
            UserRequest businessUserRequest =
                    UserRequest.builder()
                            .username(authUser.getUsername())
                            .email(authUser.getEmail())
                            .build();
    }

    private Set<Role> getDefaultRoles() {
        Role userRole = roleRepo.findByRoleName("STAFF")
                .orElseGet(() -> createDefaultRole("STAFF", "Default staff role"));
        return Set.of(userRole);
    }

    private Role createDefaultRole(String roleName, String description) {
        Role role = Role.builder()
                .roleName(roleName)
                .description(description)
                .build();
        return roleRepo.save(role);
    }
}
