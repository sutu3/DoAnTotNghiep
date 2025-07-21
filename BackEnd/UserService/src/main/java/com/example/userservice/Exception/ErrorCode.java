package com.example.userservice.Exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid key", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1002,"Unauthorized", HttpStatus.UNAUTHORIZED),
    WAREHOUSE_SERVICE_NOT_WORKING(1005,"WarehouseService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    USER_NOT_FOUND(1001,"User not found",HttpStatus.NOT_FOUND),
    USER_EXIST(1002,"User is existed",HttpStatus.BAD_REQUEST),
    FULLNAME_REQUIRED(1003,"Fullname required", HttpStatus.BAD_REQUEST),
    USERNAME_REQUIRED(1002,"Tên user không được để trống", HttpStatus.BAD_REQUEST),
    USERNAME_SIZE(1003,"Tên stack phải từ {min}-{max} ký tự", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(1004,"Email required", HttpStatus.BAD_REQUEST),
    WAREHOUSE_REQUIRED(1005,"Warehouse required", HttpStatus.BAD_REQUEST),
    BIN_CAPACITY_INVALID(1004,"Dung lượng phải từ {min} đến {max}", HttpStatus.BAD_REQUEST),
    SUPPLIER_NOT_FOUND(1001,"Supplier not found",HttpStatus.NOT_FOUND),
    SUPPLIER_EXIST(1002,"Supplier is existed",HttpStatus.BAD_REQUEST),
    TASK_USER_NOT_FOUND(1001,"Mission User not found",HttpStatus.NOT_FOUND),
    TASK_USER_EXIST(1002,"Mission User is existed",HttpStatus.BAD_REQUEST),
    TASK_TYPE_NOT_FOUND(1001,"Task Type not found",HttpStatus.NOT_FOUND),
    TASK_TYPE_EXIST(1002,"Task Type is existed",HttpStatus.BAD_REQUEST),
    TASK_NOT_FOUND(1001,"Mission not found",HttpStatus.NOT_FOUND),
    TASK_EXIST(1002,"Mission is existed",HttpStatus.BAD_REQUEST),
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
