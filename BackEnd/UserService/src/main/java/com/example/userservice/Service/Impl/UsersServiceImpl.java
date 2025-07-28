package com.example.userservice.Service.Impl;

import com.example.userservice.Client.Authen.AuthenController;
import com.example.userservice.Client.Authen.Dto.Request.UserRequestAuthen;
import com.example.userservice.Client.Authen.Dto.Response.RoleResponse;
import com.example.userservice.Client.Authen.Dto.Response.UserResponseClient;
import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.userservice.Dto.Request.UpdateRole;
import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.User.IdWarehouseResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Enum.StatusEnum;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Mapper.UserMapper;
import com.example.userservice.Model.Users;
import com.example.userservice.Repo.UserRepo;
import com.example.userservice.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UsersServiceImpl implements UserService {

    UserMapper userMapper;
    UserRepo userRepo;
    WarehouseController warehouseService; // Sử dụng Feign Client đúng chức năng
    AsyncServiceImpl asyncServiceImpl;
    private final AuthenController authenController;

    @Override
    public Page<UserResponse> getAllByWarehouseId(String warehouseId,Pageable pageable) {
        return userRepo.findByWarehouses(warehouseId,pageable)
                .map(this::enrich);
    }

    @Override
    public Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable) {
        return userRepo.findByUserName(userName, pageable)
                .map(this::enrich);
    }

    @Override
    public IdWarehouseResponse getWarehouseByIdUser() {
        var idUser=GetCurrentUserId.getCurrentUserId();
        String warehouse=findById(idUser).getWarehouses();
        return new IdWarehouseResponse(warehouse);
    }

    @Override
    public UserResponse CreateUser(UserRequest request) {
        if (userRepo.existsByPhoneNumberAndEmail(request.phoneNumber(), request.email())) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        Users user = userMapper.toEntity(request);
        user.setStatus(StatusEnum.Active);
        user.setIsDeleted(false);

        Users savedUser = userRepo.save(user);
        authenController.createUser(new UserRequestAuthen(savedUser.getUserName(), user.getEmail(), user.getEmail(), savedUser.getUserId()));
        return enrich(savedUser);
    }

    @Override
    public UserResponse UpdateRoleUser(String userId ,UpdateRole updateRole) {
        Users user = findById(userId);
        UserResponseClient userUpdateRole=authenController.updateRoleUser(user.getEmail(),updateRole).getResult();
        UserResponse userResponse=userMapper.toResponse(user);
        userResponse.setRoles(userUpdateRole.getRoles());
        return userResponse;
    }

    @Override
    public String DeletedUser(String id) {
        Users user = findById(id);
        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepo.save(user);
        return "Deleted Completed";
    }

    @Override
    public Users findById(String id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public UserResponse getByIdResponse(String id) {
        return userMapper.toResponse(findById(id));
    }

    @Override
    public UserResponse findByEmail(String email) {
        Users users=userRepo.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return  userMapper.toResponse(users);
    }

    @Override
    public UserResponse getByUserId() {
        var idUser=GetCurrentUserId.getCurrentUserId();
        return enrich(findById(idUser));
    }

    @Override
    public UserResponse enrich(Users users) {
        CompletableFuture<WarehousesResponse> warehouseFuture = asyncServiceImpl.getWarehouseAsync(users.getWarehouses());
        CompletableFuture<Set<RoleResponse>> rolesFuture = asyncServiceImpl.getRoleAsync(users.getUserId());

        CompletableFuture.allOf( warehouseFuture,rolesFuture).join();
        UserResponse response = userMapper.toResponse(users);
        response.setWarehouses(warehouseFuture.join());
        response.setRoles(rolesFuture.join());
        return response;
    }

    @Override
    public List<UserResponse> getActiveUsersByWarehouse(String warehouseId) {
        List<Users> activeUsers = userRepo.findActiveUsersByWarehouse(warehouseId);
        return activeUsers.stream()
                .map(this::enrich)
                .collect(Collectors.toList());
    }
}
