package com.example.inventoryservice.Exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid key", HttpStatus.BAD_REQUEST),
    WAREHOUSE_SERVICE_NOT_WORKING(1005,"WarehouseService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    PRODUCT_SERVICE_NOT_WORKING(1005,"ProductService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    ORDER_SERVICE_NOT_WORKING(1005,"OrderService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    USER_SERVICE_NOT_WORKING(1005,"UserService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    INVENTORY_PRODUCT_NOT_FOUND(1003,"Inventory product not found", HttpStatus.NOT_FOUND),
    INVENTORY_PRODUCT_EXISTS(1003,"Inventory product exists", HttpStatus.CONFLICT),
    INSUFFICIENT_STOCK(1003,"Insufficient stock", HttpStatus.FORBIDDEN),
    INVENTORY_CHECK_SHEET_NOT_FOUND(1040, "Inventory check sheet not found", HttpStatus.NOT_FOUND),
    INVENTORY_CHECK_DETAIL_NOT_FOUND(1041, "Inventory check detail not found",HttpStatus.NOT_FOUND),
    CHECK_SHEET_NUMBER_EXISTS(1042, "Check sheet number already exists",HttpStatus.BAD_REQUEST),
    CHECK_SHEET_CANNOT_BE_MODIFIED(1043, "Check sheet cannot be modified", HttpStatus.BAD_REQUEST),
    CHECK_SHEET_CANNOT_BE_DELETED(1044, "Check sheet cannot be deleted", HttpStatus.BAD_REQUEST),
    CHECK_SHEET_ALREADY_PROCESSED(1045, "Check sheet already processed", HttpStatus.BAD_REQUEST),
    INVENTORY_WAREHOUSE_NOT_FOUND(1004,"Warehouse not found", HttpStatus.NOT_FOUND),

    STOCK_MOVEMENT_NOT_FOUND(1004,"StockMovement not found", HttpStatus.NOT_FOUND),
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
