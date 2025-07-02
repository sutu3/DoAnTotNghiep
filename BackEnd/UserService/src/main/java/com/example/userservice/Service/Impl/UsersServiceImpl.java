package com.example.userservice.Service.Impl;

import com.example.userservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.userservice.Client.WarehouseService.WarehouseController;
import com.example.userservice.Dto.Request.UserRequest;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UsersServiceImpl implements UserService {

    UserMapper userMapper;
    UserRepo userRepo;
    WarehouseController warehouseService; // Sử dụng Feign Client đúng chức năng

    @Override
    public Page<UserResponse> getAllByWarehouseId(String warehouseId,Pageable pageable) {
        return userRepo.findByWarehouses(warehouseId,pageable)
                .map(user -> {
                    UserResponse response = userMapper.toResponse(user);
                    WarehousesResponse warehouse = null;
                    warehouse = warehouseService.getWarehouse(user.getWarehouses()).getResult();
                    return MapperUserResponse(response, warehouse);
                })
                ;
    }

    @Override
    public Page<UserResponse> getAllUserByUserName(String userName, Pageable pageable) {
        return userRepo.findByUserName(userName, pageable)
                .map(user -> {
                    UserResponse response = userMapper.toResponse(user);
                    WarehousesResponse warehouse = null;
                    warehouse = warehouseService.getWarehouse(user.getWarehouses()).getResult();
                    return MapperUserResponse(response, warehouse);
                });
    }

    @Override
    public UserResponse CreateUser(UserRequest request) {
        if (userRepo.existsByPhoneNumberAndEmail(request.phoneNumber(), request.email())) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        WarehousesResponse warehouses= warehouseService.getWarehouse(request.warehouses()).getResult();
        Users user = userMapper.toEntity(request);
        user.setStatus(StatusEnum.Active);
        user.setIsDeleted(false);

        Users savedUser = userRepo.save(user);
        UserResponse response = userMapper.toResponse(savedUser);
        return userMapper.updateWarehouse(response, warehouses);
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
    public UserResponse getByUserId(String id) {
        return userMapper.toResponse(findById(id));
    }

    @Override
    public UserResponse MapperUserResponse(UserResponse response, WarehousesResponse warehousesResponse) {
        return UserResponse.builder()
                .userId(response.getUserId())
                .userName(response.getUserName())
                .fullName(response.getFullName())
                .email(response.getEmail())
                .urlImage(response.getUrlImage())
                .phoneNumber(response.getPhoneNumber())
                .status(response.getStatus())
                .taskUsers(response.getTaskUsers())
                .warehouses(warehousesResponse)
                .createdAt(response.getCreatedAt())
                .updatedAt(response.getUpdatedAt())
                .isDeleted(response.getIsDeleted())
                .deletedAt(response.getDeletedAt())
                .build();
    }
}
