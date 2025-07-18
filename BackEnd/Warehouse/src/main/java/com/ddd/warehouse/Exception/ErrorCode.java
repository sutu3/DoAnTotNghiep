package com.ddd.warehouse.Exception;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid key", HttpStatus.BAD_REQUEST),
    INVALID_OCCUPANCY(1002,"Invalid occupancy", HttpStatus.BAD_REQUEST),
    BIN_CAPACITY_EXCEEDED(1003,"Bin capacity exceeded", HttpStatus.BAD_REQUEST),
    CAPICITY_INVALID(1003,"Invalid capacity", HttpStatus.BAD_REQUEST),
    WAREHOUSE_NOT_FOUND(1001,"Warehouse not found",HttpStatus.NOT_FOUND),
    WAREHOUSE_EXIST(1002,"Manager Warehouse is existed",HttpStatus.BAD_REQUEST),
    STACK_NOT_FOUND(1001,"Stack not found",HttpStatus.NOT_FOUND),
    STACK_EXIST(1002,"Stack is existed",HttpStatus.BAD_REQUEST),
    STACK_NAME_REQUIRED(1002,"Tên stack không được để trống", HttpStatus.BAD_REQUEST),
    STACK_NAME_SIZE(1003,"Tên stack phải từ {min}-{max} ký tự", HttpStatus.BAD_REQUEST),
    BIN_CAPACITY_INVALID(1004,"Dung lượng phải từ {min} đến {max}", HttpStatus.BAD_REQUEST),
    BIN_NOT_FOUND(1001,"Bin not found",HttpStatus.NOT_FOUND),
    BIN_EXIST(1002,"Bin is existed",HttpStatus.BAD_REQUEST),
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
