package com.ddd.fileservice.Config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloundinaryConfig {
    @Bean
    public Cloudinary cloudinaryConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dclib4xzd");
        config.put("api_key", "726942689373288");
        config.put("api_secret", "mMV8mQaatgJAppzRh-z0_BroibE");
        return new Cloudinary(config);
    }
}
