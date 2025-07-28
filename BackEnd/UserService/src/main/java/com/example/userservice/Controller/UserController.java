package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.UpdateRole;
import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.User.IdWarehouseResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "User API", description = "Quản lý người dùng trong kho")

public class UserController {
    UserService userService;
    @GetMapping("/search/warehouses/{warehouseId}")
    public ApiResponse<Page<UserResponse>> getAll(
            @PathVariable String warehouseId,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<UserResponse>>builder()
                .Result(userService.getAllByWarehouseId(warehouseId,pageable))
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/search/warehouses/{warehouseId}/active")
    public ApiResponse<List<UserResponse>> getActiveUsersByWarehouse(
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<UserResponse>>builder()
                .Result(userService.getActiveUsersByWarehouse(warehouseId))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @PutMapping("/search/user/{userId}/roles")
    public ApiResponse<UserResponse> updateRoleUser(
            @PathVariable String userId,
            @RequestBody UpdateRole updateRole
    ) {
        return ApiResponse.<UserResponse>builder()
                .Result(userService.UpdateRoleUser(userId,updateRole))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/GetIdWarehouseByIdUser")
    public ApiResponse<IdWarehouseResponse> getIdWarehouseByIdUser(){
        return ApiResponse.<IdWarehouseResponse>builder()
                .Result(userService.getWarehouseByIdUser())
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/search/userName/{name}")
    public ApiResponse<Page<UserResponse>> getAllByUserName(
            @PathVariable String name,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<UserResponse>>builder()
                .Result(userService.getAllUserByUserName(name,pageable))
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest request){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.CreateUser(request))
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> DeletedUser(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(userService.DeletedUser(id))
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/search/idUser")
    public ApiResponse<UserResponse> getById(){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.getByUserId())
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/search/email/{email}")
    public ApiResponse<UserResponse> getByEmal(@PathVariable String email){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.findByEmail(email))
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getByIdUser(@PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.getByIdResponse(id))
                .message("SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
