package com.example.inventoryservice.Enum;

public enum WarehouseItemStatus {
    AVAILABLE,//Sản phẩm có sẵn và sẵn sàng để sử dụng/xuất kho
    RESERVED,//Sản phẩm đã được đặt trước/giữ chỗ cho đơn hàng cụ thể
    EXPIRED,//Sản phẩm đã hết hạn sử dụng
    DAMAGED,//Sản phẩm bị hư hỏng, không thể sử dụng
    QUARANTINE//Sản phẩm đang được cách ly để kiểm tra chất lượng
}
