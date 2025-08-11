package com.example.order.Utils;

import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
import com.example.order.Module.DeliveryItem;
import com.example.order.Module.ReceiptItem;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ConvertToBaseUnit {
    ProductController  productController;
    public BigDecimal convertToBaseUnitPreciseReceipt(ReceiptItem receiptItem) {
        try {
            String unitId = receiptItem.getImportItem().getUnit();
            String productId = receiptItem.getImportItem().getProduct();

            UnitNameResponse unitResponse = productController.getUnitById(unitId).getResult();
            UnitNameResponse productUnitResponse = productController.getProductById(productId).getResult().getUnit();

            BigDecimal receivedQuantity = new BigDecimal(receiptItem.getReceivedQuantity());
            BigDecimal ratioToBase = new BigDecimal(String.valueOf(unitResponse.getRatioToBase()));
            BigDecimal ratioBase = new BigDecimal(String.valueOf(productUnitResponse.getRatioToBase()));

            if (ratioBase.compareTo(BigDecimal.ZERO) == 0) {
                log.error("Invalid ratioBase (divide by zero): productId={}", productId);
                return receivedQuantity;
            }

            return receivedQuantity.multiply(ratioToBase).divide(ratioBase, 6, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.error("Failed to convert unit for receipt item: {}", receiptItem.getReceiptItemId(), e);
            return new BigDecimal(receiptItem.getReceivedQuantity());
        }
    }
    public BigDecimal convertToBaseUnitPreciseDelivery(DeliveryItem deliveryItem) {
        try {
            String unitId = deliveryItem.getExportItem().getUnit();
            String productId = deliveryItem.getExportItem().getProduct();

            UnitNameResponse unitResponse = productController.getUnitById(unitId).getResult();
            UnitNameResponse productUnitResponse = productController.getProductById(productId).getResult().getUnit();

            BigDecimal receivedQuantity = deliveryItem.getDeliveredQuantity();
            BigDecimal ratioToBase = new BigDecimal(String.valueOf(unitResponse.getRatioToBase()));
            BigDecimal ratioBase = new BigDecimal(String.valueOf(productUnitResponse.getRatioToBase()));

            if (ratioBase.compareTo(BigDecimal.ZERO) == 0) {
                log.error("Invalid ratioBase (divide by zero): productId={}", productId);
                return receivedQuantity;
            }

            return receivedQuantity.multiply(ratioToBase).divide(ratioBase, 6, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.error("Failed to convert unit for receipt item: {}", deliveryItem.getDeliveredQuantity(), e);
            return deliveryItem.getDeliveredQuantity();
        }
    }


}
