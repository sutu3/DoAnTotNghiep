package com.example.gatewayservice.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SwaggerController {

    @GetMapping("/swagger")
    public String swaggerIndex() {
        return """  
            <html>  
            <body>  
                <h1>API Documentation</h1>  
                <ul>  
                    <li><a href="/user-service/swagger-ui.html">User Service</a></li>  
                    <li><a href="/warehouse-service/swagger-ui.html">Warehouse Service</a></li>  
                    <li><a href="/file-service/swagger-ui.html">File Service</a></li>  
                    <li><a href="/authen-service/swagger-ui.html">Authentication Service</a></li>  
                </ul>  
            </body>  
            </html>  
            """;
    }
}
