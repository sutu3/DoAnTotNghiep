package com.example.authenservice.Security;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
public class AuthenticationRequestInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();

        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            var authHeader = servletRequestAttributes.getRequest().getHeader("Authorization");

            log.info("Header: {}", authHeader);
            if (StringUtils.hasText(authHeader)) {
                template.header("Authorization", authHeader);
            }
        } else {
            log.warn("No request context available - skipping Authorization header injection.");
        }
    }
}
