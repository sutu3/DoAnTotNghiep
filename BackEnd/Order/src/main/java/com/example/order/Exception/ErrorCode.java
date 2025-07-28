package com.example.order.Exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
public enum ErrorCode {
    INVALID_KEY(1001,"Invalid key", HttpStatus.BAD_REQUEST),
    INVALID_QUANTITY(1002,"Invalid quantity", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS(1003,"Invalid order status", HttpStatus.BAD_REQUEST),
    WAREHOUSE_SERVICE_NOT_WORKING(1005,"WarehouseService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    PRODUCT_SERVICE_NOT_WORKING(1005,"ProductService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    INVENTORY_SERVICE_NOT_WORKING(1005,"InventoryService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    INVENTORY_CREATION_FAILED(1006,"Inventory creation failed", HttpStatus.SERVICE_UNAVAILABLE),
    USER_SERVICE_NOT_WORKING(1005,"UserService not connected", HttpStatus.SERVICE_UNAVAILABLE),
    IMPORT_EXECUTION_FAILED(1006,"Import execution failed", HttpStatus.SERVICE_UNAVAILABLE),
    IMPORT_ITEM_NOT_FOUND(1002,"Import Item not found", HttpStatus.NOT_FOUND),
    IMPORT_ITEM_EXISTS(1003,"Import Item already exists", HttpStatus.CONFLICT),
    EXPORT_EXECUTION_FAILED(1003,"Export execution failed", HttpStatus.SERVICE_UNAVAILABLE),
    EXPORT_ITEM_NOT_FOUND(1002,"Export Item not found", HttpStatus.NOT_FOUND),
    RECEIPT_ITEM_NOT_FOUND(1003,"Receipt Item not found", HttpStatus.NOT_FOUND),
    SYNC_FAILED(1007,"Sync failed", HttpStatus.SERVICE_UNAVAILABLE),
    EXPORT_ITEM_EXISTS(1003,"Export Item already exists", HttpStatus.CONFLICT),
    IMPORT_ORDER_NOT_FOUND(1002,"Import Order not found", HttpStatus.NOT_FOUND),
    IMPORT_ORDER_EXISTS(1003,"Import Order already exists", HttpStatus.CONFLICT),
    EXPORT_ORDER_NOT_FOUND(1002,"Export Order not found", HttpStatus.NOT_FOUND),
    EXPORT_ORDER_EXISTS(1003,"Export Order already exists", HttpStatus.CONFLICT),
    WAREHOUSE_RECEIPT_NOT_FOUND(1003,"Warehouse receipt not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1004,"Khong du quyen truy cap",HttpStatus.UNAUTHORIZED),
    INVENTORY_UPDATE_FAILED(1006,"Inventory update failed", HttpStatus.SERVICE_UNAVAILABLE),
    RECEIPT_ALREADY_COMPLETED(1005,"Receipt already completed", HttpStatus.CONFLICT),
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
