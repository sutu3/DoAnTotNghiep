package com.example.userservice.Controller;

import com.example.userservice.Dto.Request.UserRequest;
import com.example.userservice.Dto.Responses.ApiResponse;
import com.example.userservice.Dto.Responses.User.UserResponse;
import com.example.userservice.Service.UserService;
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
public class UserController {
    UserService userService;
    @GetMapping
    public ApiResponse<List<UserResponse>> getAll(){
        return ApiResponse.<List<UserResponse>>builder()
                .Result(userService.getAll())
                .message("SuccessFull")
                .code(0)
                .build();
    }
    @GetMapping("/search?userName={userName}&page={pageNumber}&size={pageSize}")
    public ApiResponse<Page<UserResponse>> getAllByUserName(
            @RequestParam("userName") String userName,
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<UserResponse>>builder()
                .Result(userService.getAllUserByUserName(userName,pageable))
                .message("SuccessFull")
                .code(0)
                .build();
    }
    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest request){
        return ApiResponse.<UserResponse>builder()
                .Result(userService.CreateUser(request))
                .message("SuccessFull")
                .code(0)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> DeletedUser(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(userService.DeletedUser(id))
                .message("Deleted SuccessFull")
                .code(0)
                .build();
    }
}
