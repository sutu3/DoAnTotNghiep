package com.example.authenservice.Service.Impl;

import com.example.authenservice.Dtos.Request.*;
import com.example.authenservice.Dtos.Response.AuthenticationResponse;
import com.example.authenservice.Dtos.Response.IntrospectResponse;
import com.example.authenservice.Exception.AppException;
import com.example.authenservice.Exception.ErrorCode;
import com.example.authenservice.Modal.InvalidateToken;
import com.example.authenservice.Modal.Role;
import com.example.authenservice.Modal.User;
import com.example.authenservice.Repo.InvalidateTokenRepo;
import com.example.authenservice.Repo.UserRepo;
import com.example.authenservice.Service.JavaMailSenderService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepo userRepo;
    InvalidateTokenRepo invalidateTokenRepo;
    private final JavaMailSenderService javaMailSenderService;

    @NonFinal
    @Value("${jwt.signedJWT}")
    protected String SIGN_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected Long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected Long REFRESH_DURATION;
    public IntrospectResponse introspect(IntrospectRequest request)  {
        var token = request.token();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepo
                .findByEmailWithRoles(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        boolean authenticated = passwordEncoder.matches(request.password(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user,VALID_DURATION);

        return AuthenticationResponse.builder().token(token).build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.token(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidateToken invalidatedToken =
                    InvalidateToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidateTokenRepo.save(invalidatedToken);
        } catch (AppException exception){
            log.info("Token already expired");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.token(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidateToken invalidatedToken =
                InvalidateToken.builder().id(jit).expiryTime(expiryTime).build();

        invalidateTokenRepo.save(invalidatedToken);

        var email = signedJWT.getJWTClaimsSet().getClaim("email").toString();

        var user =
                userRepo.findByEmailWithRoles(email).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user,VALID_DURATION);

        return AuthenticationResponse.builder().token(token).build();
    }

    private String generateToken(User user,Long Duration) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getIdUser())
                .issuer("warehouse.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(Duration, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("email", user.getEmail())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGN_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGN_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESH_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidateTokenRepo.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
    public AuthenticationResponse forgotPassword(String email) {
        User user=userRepo.findByEmailWithRoles(email)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        NotificationForgotPassword notification = NotificationForgotPassword.builder()
                .to(user.getEmail())
                .toName(user.getUsername())
                .content("Reset password")
                .resetLink("http://localhost:5173/reset-password?user="+user.getIdUser())
                .subject("Reset password")
                .build();

        try {
            javaMailSenderService.javaSendMailForgotPassword(notification);
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.NOTIFICATION_SEND_FAILED);
        }
        var token = generateToken(user, 10 * 60L);

        return AuthenticationResponse.builder().token(token).build();
    }
    public AuthenticationResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!request.newPassword().equals(request.newPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepo.save(user);
        var token = generateToken(user,VALID_DURATION);

        return AuthenticationResponse.builder().token(token).build();
    }
    public void changePassword(NewPasswordRequest request) {
        var userId=GetCurrentUserId.getCurrentUserId();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!request.newPassword().equals(request.newPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepo.save(user);

        ;
    }
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getRoleName());
            });

        return stringJoiner.toString();
    }

    private record TokenInfo(String token, Date expiryDate) {}
}
