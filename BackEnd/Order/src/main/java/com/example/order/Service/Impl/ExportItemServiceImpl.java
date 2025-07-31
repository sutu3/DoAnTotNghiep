package com.example.order.Service.Impl;

import com.example.order.Client.Inventory.Dto.Response.InventoryWarehouseResponse;
import com.example.order.Client.Inventory.Dto.Resquest.StockMovementRequest;
import com.example.order.Client.Inventory.InventoryController;
import com.example.order.Client.ProductService.Dto.Response.ProductResponse;
import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.UserService.Dto.Response.UserResponse;
import com.example.order.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.order.Dto.Request.ExportItemRequest;
import com.example.order.Dto.Response.Exporttem.ExportItemResponse;
import com.example.order.Dto.Response.ImportItem.ImportResponseItem;
import com.example.order.Enum.DeliveryStatus;
import com.example.order.Enum.ExportItemStatus;
import com.example.order.Enum.ExportOrderStatus;
import com.example.order.Enum.OrderStatus;
import com.example.order.Exception.AppException;
import com.example.order.Exception.ErrorCode;
import com.example.order.Form.UpdateExportItemForm;
import com.example.order.Mapper.ExportItemMapper;
import com.example.order.Module.ExportItem;
import com.example.order.Module.ExportOrder;
import com.example.order.Module.ImportOrder;
import com.example.order.Module.WarehouseDelivery;
import com.example.order.Repo.ExportItemRepo;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Service.ExportItemService;
import com.example.order.Service.ExportOrderService;
import com.example.order.Service.WarehouseDeliveryService;
import com.example.order.Utils.UpdateOrderTotalPrice;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportItemServiceImpl implements ExportItemService {
    AsyncServiceImpl asyncServiceImpl;
    ExportItemMapper exportItemMapper;
    ExportItemRepo exportItemRepo;
    ExportOrderRepo exportOrderRepo;
    ExportOrderService exportOrderService;
    UpdateOrderTotalPrice updateOrderTotalPrice;

    @Override
    public Page<ExportItemResponse> getAllByWarehouse(Pageable pageable, String warehouse) {
        return exportItemRepo.findAllByExportOrder_Warehouse(warehouse,pageable)
                .map(this::entry);
    }

    @Override
    public List<ExportItemResponse> getAllByOrder(String orderId) {
        log.info(orderId);
        return exportItemRepo.findAllByExportOrder_ExportOrderIdAndIsDeleted(orderId,false)
                .stream().map(this::entry).collect(Collectors.toList());
    }

    @Override
    public ExportItem getById(String id) {
        return exportItemRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.EXPORT_ITEM_NOT_FOUND));
    }

    @Override
    public ExportItemResponse getByIdResponse(String id) {
        return entry(getById(id));
    }

    @Override
    @Transactional
    public ExportItemResponse createItem(ExportItemRequest request) {
        log.info("Creating export item for order: {}", request.exportOrderId());

        ExportOrder exportOrder = exportOrderRepo.findByExportOrderIdAndIsDeletedFalse(request.exportOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_ORDER_NOT_FOUND));

        ExportItem exportItem = exportItemMapper.toEntity(request);
        exportItem.setIsDeleted(false);
        exportItem.setExportOrder(exportOrder);
        exportItem.setStatus(ExportItemStatus.PENDING);


        ExportItem savedItem = exportItemRepo.save(exportItem);
        log.info("Export item created with ID: {}", savedItem.getExportItemId());

        return entry(savedItem);
    }

    @Override
    @Transactional
    public List<ExportItemResponse> createItems(List<ExportItemRequest> requests) {
        List<ExportItemResponse> results = requests.stream()
                .map(this::createItem)
                .toList();
        if (!requests.isEmpty()) {
            String orderId = requests.get(0).exportOrderId();
            log.info("orderId: {}", orderId);
            ExportOrder importOrder = exportOrderService.getExportOrderById(orderId);
            updateOrderTotalPrice.updateTotalPriceExport(importOrder,results);
        }

        return results;
    }

    @Override
    @Transactional
    public ExportItemResponse updateItem(UpdateExportItemForm update, String id) {
        ExportItem exportItem = getById(id);
        exportItemMapper.toUpdate(exportItem, update);
        exportItem.setUpdatedAt(LocalDateTime.now());

        ExportItem updatedItem = exportItemRepo.save(exportItem);
        return entry(updatedItem);
    }

    @Override
    public void deleteItem(String id) {
        ExportItem exportItem = getById(id);
        exportItem.setDeletedAt(LocalDateTime.now());
        exportItem.setIsDeleted(true);
        exportItemRepo.save(exportItem);
    }

    @Override
    public ExportItemResponse updateQuantity(String itemId, Integer quantity) {
        ExportItem exportItem = getById(itemId);
        exportItem.setQuantity(quantity);
        ExportItem savedItem = exportItemRepo.save(exportItem);
        return entry(savedItem);
    }

    @Override
    public ExportItemResponse updateBinLocation(String itemId, String binLocation) {
        ExportItem exportItem = getById(itemId);
        exportItem.setBinLocation(binLocation);
        ExportItem savedItem = exportItemRepo.save(exportItem);
        return entry(savedItem);
    }

    @Override
    @Transactional
    public void executeExport(String orderId, List<ExportItemRequest> items) {
        try {

            // Get all items by order
            List<ExportItemResponse> list = getAllByOrder(orderId);

            // Process each item
            int itemIndex = 0;
            for (ExportItemResponse item : list) {
                itemIndex++;
                try {
                    // Update item status to PICKED
                    ExportItem exportItem = getById(item.getExportItemId());

                    exportItem.setStatus(ExportItemStatus.SHIPPED);
                    exportItemRepo.save(exportItem);


                } catch (Exception itemException) {
                    throw itemException;
                }
            }

            exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.IN_PROGRESS);

        } catch (Exception e) {

            try {
                exportOrderService.updateExportOrderStatus(orderId, ExportOrderStatus.CANCELLED);
            } catch (Exception statusUpdateException) {
            }

            throw new AppException(ErrorCode.EXPORT_EXECUTION_FAILED);
        }
    }

    @Override
    public ExportItemResponse entry(ExportItem exportItem) {
        CompletableFuture<ProductResponse> productFuture = asyncServiceImpl
                .getProductAsync(exportItem.getProduct());
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl
                .getUserAsync(exportItem.getExportOrder().getCreateByUser());
        CompletableFuture<UnitNameResponse> unitFuture = asyncServiceImpl
                .getUnitAsync(exportItem.getUnit());
        CompletableFuture<BinResponse> binFuture = asyncServiceImpl
                .getBinAsync(exportItem.getBinLocation());
        CompletableFuture.allOf(productFuture, userFuture,binFuture).join();

        ExportItemResponse response = exportItemMapper.toResponse(exportItem);
        response.setProduct(productFuture.join());
        response.setCreateByUser(userFuture.join());
        response.setUnit(unitFuture.join());
        response.setBin(binFuture.join());
        return response;
    }
}
