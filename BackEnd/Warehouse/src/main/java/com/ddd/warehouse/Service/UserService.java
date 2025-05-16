package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.UserRequest;
import com.ddd.warehouse.Dto.Response.User.UserResponse;
import com.ddd.warehouse.Enum.Userenum;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Mapper.UserMapper;
import com.ddd.warehouse.Module.User;
import com.ddd.warehouse.Repo.UserRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UserService {
    UserRepo userRepo;
    UserMapper userMapper;

    public List<UserResponse> getall(){
        return userRepo.findAll().stream()
                .map(userMapper::toResponse).collect(Collectors.toList());
    }
    public UserResponse findById(String id){
        User user=userRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }
    public UserResponse createUser(UserRequest request){
        if(userRepo.existsByEmailAndPhoneNumber(request.email(),request.phoneNumber())){
            throw new AppException(ErrorCode.USER_EXIST);
        }
        User user=userMapper.toEntity(request);
        user.setUrlImage("https://www.gettyimages.com/photos/user-avatar");
        user.setStatus(Userenum.active);
        user.setIsDeleted(false);
        return userMapper.toResponse(userRepo.save(user));
    }
    public String deletedUser(String id){
        User user=userRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepo.save(user);
        return "Deleted SuccessFull";

    }
}
