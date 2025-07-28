package com.example.order.Enum;

public enum OrderStatus {
    Created,        // Đã tạo yêu cầu
    InProgress,     // Admin đã duyệt, đang chờ hàng
    Goods_Arrived,  // Hàng đã đến kho
    Done,          // Hoàn thành nhập kho
    Cancel
}
