package com.example.order.Utils;

import com.example.order.Client.ProductService.Dto.Response.UnitNameResponse;
import com.example.order.Client.ProductService.ProductController;
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
    public BigDecimal convertToBaseUnitPrecise(ReceiptItem receiptItem) {
        try {
            log.info("Receipt Item ID: {}", receiptItem.getReceiptItemId());
            log.info("Import Item ID: {}", receiptItem.getImportItem().getItemId());
            log.info("Import Item Unit field: {}", receiptItem.getImportItem().getUnit());

            // Kiểm tra xem unit ID có giống với receipt item ID không
            if (receiptItem.getReceiptItemId().equals(receiptItem.getImportItem().getUnit())) {
                log.error("CRITICAL: Unit ID is same as Receipt Item ID - data corruption detected!");
            }
            String unitId = receiptItem.getImportItem().getUnit();
            UnitNameResponse unitResponse = productController.getUnitById(unitId).getResult();

            BigDecimal receivedQuantity = new BigDecimal(receiptItem.getReceivedQuantity());
            BigDecimal ratioToBase = new BigDecimal(unitResponse.getRatioToBase().toString());

            // Quy đổi với độ chính xác cao, làm tròn 6 chữ số thập phân
            return receivedQuantity.multiply(ratioToBase)
                    .setScale(6, RoundingMode.HALF_UP);

        } catch (Exception e) {
            log.error("Failed to convert unit for receipt item: {}", receiptItem.getReceiptItemId(), e);
            return new BigDecimal(receiptItem.getReceivedQuantity());
        }
    }
}
