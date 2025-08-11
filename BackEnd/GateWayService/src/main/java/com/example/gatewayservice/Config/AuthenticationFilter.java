package com.example.gatewayservice.Config;

import com.example.gatewayservice.Response.ApiResponse;
import com.example.gatewayservice.Service.IdentityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    IdentityService identityService;
    ObjectMapper objectMapper;

    @NonFinal
    private String[] publicEndpoints = {
            "/identity/users/registration",
            "/notification/email/send",
            "/file/media/download/.*",
            "/api/authen/api/auth/login",
            "/api/authen/api/auth/logout",
            "/api/authen/api/auth/forgot-password",
            "/api/users/.*",
            "/api/authen/.*",
            "/api/orders/.*",
            "/api/inventories/.*",
            "/swagger-ui/.*",
            "/api/file/.*",
            "/v3/api-docs/.*",
            "/api/products/.*",
    };

    @Value("${app.api-prefix}")
    @NonFinal
    private String apiPrefix;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().toString();

        log.info("=== AUTHENTICATION FILTER START ===");
        log.info("Request Path: {}", path);
        log.info("Request Method: {}", method);
        log.info("Request Headers: {}", exchange.getRequest().getHeaders());

        // Check if public endpoint
        boolean isPublic = isPublicEndpoint(exchange.getRequest());
        log.info("Is Public Endpoint: {}", isPublic);

        if (isPublic) {
            log.info("Public endpoint detected, skipping authentication");
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                log.info("Response status: {}", exchange.getResponse().getStatusCode());
                log.info("Response headers: {}", exchange.getResponse().getHeaders());
            }));
        }

        // Get token from authorization header
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        log.info("Authorization Header: {}", authHeader);

        if (CollectionUtils.isEmpty(authHeader)) {
            log.warn("No Authorization header found");
            return unauthenticated(exchange.getResponse());
        }

        String token = authHeader.getFirst().replace("Bearer ", "");
        log.info("Extracted Token: {}", token.substring(0, Math.min(token.length(), 50)) + "...");

        log.info("Calling identity service introspect...");
        return identityService.introspect(token)
                .doOnNext(introspectResponse -> {
                    log.info("Introspect Response received: {}", introspectResponse);
                    log.info("Token is valid: {}", introspectResponse.getResult().isValid());
                })
                .flatMap(introspectResponse -> {
                    if (introspectResponse.getResult().isValid()) {
                        log.info("Token validation successful, proceeding to next filter");
                        return chain.filter(exchange);
                    } else {
                        log.warn("Token validation failed");
                        return unauthenticated(exchange.getResponse());
                    }
                })
                .doOnError(throwable -> {
                    log.error("Error during token introspection: ", throwable);
                })
                .onErrorResume(throwable -> {
                    log.error("Fallback to unauthenticated due to error");
                    return unauthenticated(exchange.getResponse());
                })
                .doFinally(signalType -> {
                    log.info("=== AUTHENTICATION FILTER END === Signal: {}", signalType);
                });
    }

    private boolean isPublicEndpoint(ServerHttpRequest request){
        String path = request.getURI().getPath();
        log.info("Checking if path '{}' is public endpoint", path);

        for (String endpoint : publicEndpoints) {
            boolean matches = path.matches(endpoint);
            log.info("Path '{}' matches pattern '{}': {}", path, endpoint, matches);
            if (matches) {
                log.info("Public endpoint match found: {}", endpoint);
                return true;
            }
        }

        log.info("No public endpoint match found for path: {}", path);
        return false;
    }

    Mono<Void> unauthenticated(ServerHttpResponse response){
        log.warn("Returning unauthenticated response");

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(1401)
                .message("Unauthenticated")
                .build();
        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
            log.info("Unauthenticated response body: {}", body);
        } catch (JsonProcessingException e) {
            log.error("Error serializing unauthenticated response", e);
            throw new RuntimeException(e);
        }

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        log.info("Response headers set: {}", response.getHeaders());
        log.info("Response status: {}", response.getStatusCode());

        return response.writeWith(
                Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
