package com.example.order.Service;

import com.example.order.Dto.Request.ReceiptItemRequest;
import com.example.order.Dto.Request.WarehouseReceiptRequest;
import com.example.order.Dto.Response.WarehouseReceipt.WarehouseReceiptResponse;
import com.example.order.Enum.ReceiptStatus;
import com.example.order.Module.WarehouseReceipt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface WarehouseReceiptService {
    WarehouseReceiptResponse createReceipt(WarehouseReceiptRequest request);
    WarehouseReceipt getById(String receiptId);
    WarehouseReceiptResponse getByIdResponse(String receiptId);
    List<WarehouseReceiptResponse> getByOrderId(String orderId);
    WarehouseReceiptResponse addReceiptItem(String receiptId, ReceiptItemRequest request);
    WarehouseReceiptResponse updateReceiptStatus(String receiptId, ReceiptStatus status);
    List<WarehouseReceiptResponse> getAllByWarehouseId(String warehouseId);
    void completeReceipt(String receiptId);
    WarehouseReceiptResponse entry(WarehouseReceipt receipt);
    WarehouseReceiptResponse updateReceiptItem(String receiptId, String receiptItemId, ReceiptItemRequest request);
}
