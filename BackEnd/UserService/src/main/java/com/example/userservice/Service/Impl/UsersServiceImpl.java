package com.example.userservice.Service.Impl;


import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Enum.StatusEnum;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Mapper.UserMapper;
import com.example.userservice.Model.Users;
import com.example.userservice.Repo.UserRepo;
import com.example.userservice.Service.UserService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UsersServiceImpl implements UserService {
    UserMapper userMapper;
    UserRepo userRepo;

    @Override
    public List<UserResponse> getAll() {
        return userRepo.findAll().stream().map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable) {
        return userRepo.findByUserName(userName, pageable).map(userMapper::toResponse);
    }

    @Override
    public UserResponse CreateUser(UserRequest request) {
        if (userRepo.exsistByPhoneNumberAndEmail(request.phoneNumber(), request.email())) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        Users user = userMapper.toEntity(request);
        user.setStatus(StatusEnum.Active);
        user.setIsDeleted(false);
        return userMapper.toResponse(userRepo.save(user));
    }


    @Override
    public String DeletedUser(String id) {
        Users user=userRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepo.save(user);
        return "Deleted Completed";
    }


}
