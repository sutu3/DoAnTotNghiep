package com.example.productservice.Exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid key", HttpStatus.BAD_REQUEST),
    WAREHOUSE_SERVICE_NOT_WORKING(1005,"WarehouseService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    USER_SERVICE_NOT_WORKING(1005,"UserService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    CATEGORY_NOT_FOUND(1002,"Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTS(1003,"Category already exists", HttpStatus.CONFLICT),
    PRODUCT_NOT_FOUND(1002,"Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_EXISTS(1003,"Product already exists", HttpStatus.CONFLICT),
    GROUP_UNIT_NOT_FOUND(1002,"Group Unit not found", HttpStatus.NOT_FOUND),
    GROUP_UNIT_EXISTS(1003,"Group Unit already exists", HttpStatus.CONFLICT),
    UNIT_NOT_FOUND(1002,"Unit not found", HttpStatus.NOT_FOUND),
    UNIT_EXISTS(1003,"Unit already exists", HttpStatus.CONFLICT),
    UNAUTHENTICATED(1004,"Khong du quyen truy cap",HttpStatus.UNAUTHORIZED),
    UNCATEGORIZED(9999,"Uncategorized", HttpStatus.INTERNAL_SERVER_ERROR);
    ErrorCode(int Code,String Message, HttpStatusCode sponse){
        this.code = Code;
        this.message = Message;
        this.status = sponse;
    }
    private int code;
    private String message;
    private HttpStatusCode status;
}
