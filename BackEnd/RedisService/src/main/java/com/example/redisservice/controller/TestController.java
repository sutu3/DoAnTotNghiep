package com.example.redisservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/redis-connection")
    public String testRedisConnection() {
        try {
            // Test basic connection
            redisTemplate.opsForValue().set("test", "connection-test");
            String value = (String) redisTemplate.opsForValue().get("test");
            logger.info("Redis connection test successful. Value: {}", value);
            return "Redis connection successful! Value: " + value;
        } catch (Exception e) {
            logger.error("Redis connection failed", e);
            return "Redis connection failed: " + e.getMessage();
        }
    }

    @GetMapping("/ping")
    public String ping() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return "Redis PING successful";
        } catch (Exception e) {
            logger.error("Redis PING failed", e);
            return "Redis PING failed: " + e.getMessage();
        }
    }
}

