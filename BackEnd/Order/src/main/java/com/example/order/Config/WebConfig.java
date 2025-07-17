//package com.example.order.Config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.web.config.EnableSpringDataWebSupport;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
//public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**") // Apply CORS policy to all endpoints
//                .allowedOrigins("http://localhost:5173") // Allowed origins
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // HTTP methods
//                .allowedHeaders("*") // Allowed headers
//                .allowCredentials(true); // Allow credentials (cookies, Authorization headers, etc.)
//    }
//}
