package com.example.productservice.Security;

import com.example.productservice.Util.TokenContextHolder;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
public class AuthenticationRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes servletRequestAttributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        String authHeader = null;

        if (servletRequestAttributes != null) {
            authHeader = servletRequestAttributes.getRequest().getHeader("Authorization");
            log.info("Header from ServletRequestAttributes: {}", authHeader);
        } else {
            // Fallback to ThreadLocal token
            authHeader = TokenContextHolder.getToken();
            log.info("Header from TokenContextHolder: {}", authHeader);
            log.warn("No ServletRequestAttributes found in RequestContextHolder, using ThreadLocal token");
        }

        if (StringUtils.hasText(authHeader)) {
            template.header("Authorization", authHeader);
        } else {
            log.warn("No Authorization header available");
        }
    }
}
