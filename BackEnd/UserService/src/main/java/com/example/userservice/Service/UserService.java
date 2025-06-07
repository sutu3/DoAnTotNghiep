package com.example.userservice.Service;

import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<UserResponse> getAll();
    Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable);
    UserResponse CreateUser(UserRequest request);
    String DeletedUser(String id);
}
