package com.example.order.Service;

import com.example.order.Dto.Request.DeliveryItemRequest;
import com.example.order.Dto.Request.WarehouseDeliveryRequest;
import com.example.order.Dto.Response.WarehouseDelivery.WarehouseDeliveryResponse;
import com.example.order.Enum.DeliveryStatus;
import com.example.order.Module.WarehouseDelivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface WarehouseDeliveryService {
    WarehouseDeliveryResponse createDelivery(WarehouseDeliveryRequest request);
    WarehouseDelivery getById(String deliveryId);
    WarehouseDeliveryResponse getByIdResponse(String deliveryId);
    List<WarehouseDeliveryResponse> getByOrderId(String orderId);
    Page<WarehouseDeliveryResponse> getByStatusAndWarehouse(String warehouseId, String status, Pageable pageable);

    WarehouseDeliveryResponse addDeliveryItem(String deliveryId, DeliveryItemRequest request);
    WarehouseDeliveryResponse updateDeliveryStatus(String deliveryId, DeliveryStatus status);
    List<WarehouseDeliveryResponse> getAllByWarehouseId(String warehouseId);
    WarehouseDeliveryResponse completeDelivery(String deliveryId);
    WarehouseDeliveryResponse entry(WarehouseDelivery delivery);
    WarehouseDeliveryResponse updateDeliveryItem(String deliveryId, String deliveryItemId, DeliveryItemRequest request);
    void deleteDelivery(String deliveryId);
    WarehouseDelivery getByOrderId(String exportOrderId, Boolean isDeleted);
}
