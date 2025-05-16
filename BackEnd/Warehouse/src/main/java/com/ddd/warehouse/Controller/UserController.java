package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.UserRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.User.UserResponse;
import com.ddd.warehouse.Service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;
    @GetMapping("/getAll")
    public ApiResponse<List<UserResponse>> getall(){
        return ApiResponse.<List<UserResponse>>builder()
                .Result(userService.getall())
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.findById(id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @PostMapping("/create")
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest request){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.createUser(request))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteById(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(userService.deletedUser(id))
                .message("Delete SuccessFull")
                .success(true)
                .code(0).build();
    }
}
