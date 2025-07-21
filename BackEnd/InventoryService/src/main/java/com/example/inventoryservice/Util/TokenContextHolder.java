package com.example.inventoryservice.Util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class TokenContextHolder {
    private static final ThreadLocal<String> tokenHolder = new ThreadLocal<>();

    public static void setToken(String token) {
        tokenHolder.set(token);
    }

    public static String getToken() {
        return tokenHolder.get();
    }

    public static void clear() {
        tokenHolder.remove();
    }

    public static String getCurrentToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            return "Bearer " + jwtToken.getToken().getTokenValue();
        }
        return getToken();
    }
}
