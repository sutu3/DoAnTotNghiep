package com.example.authenservice.Controller;

import com.example.authenservice.Dtos.ApiResponse;
import com.example.authenservice.Dtos.Request.*;
import com.example.authenservice.Dtos.Response.AuthenticationResponse;
import com.example.authenservice.Dtos.Response.IntrospectResponse;
import com.example.authenservice.Service.Impl.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authen API", description = "Quản lý token bên xác thực")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenController {
    AuthenticationService authService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) throws JOSEException {
        return ApiResponse.<AuthenticationResponse>builder()
                .Result(authService.authenticate(request))
                .message("Login successful")
                .success(true)
                .code(0)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        return ApiResponse.<IntrospectResponse>builder()
                .Result(authService.introspect(request))
                .message("Token introspection completed")
                .success(true)
                .code(0)
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) throws JOSEException, ParseException {
        return ApiResponse.<AuthenticationResponse>builder()
                .Result(authService.refreshToken(request))
                .message("Token refreshed successfully")
                .success(true)
                .code(0)
                .build();
    }
    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestBody LogoutRequest request) throws JOSEException, ParseException {
        authService.logout(request);
        return ApiResponse.<String>builder()
                .Result("Logged out successfully")
                .message("Logout successful")
                .success(true)
                .code(0)
                .build();
    }
    @PostMapping("/forgot-password")
    public ApiResponse<AuthenticationResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .Result(authService.forgotPassword(request.email()))
                .message("Send Mail successful")
                .success(true)
                .code(0)
                .build();
    }
    @PutMapping("/reset-password")
    public ApiResponse<AuthenticationResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .Result(authService.resetPassword(request))
                .message("Reset Password successful")
                .success(true)
                .code(0)
                .build();
    }
    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody NewPasswordRequest request) {
        authService.changePassword(request);
        return ApiResponse.<Void>builder()
                .message("Reset Password successful")
                .success(true)
                .code(0)
                .build();
    }
}
