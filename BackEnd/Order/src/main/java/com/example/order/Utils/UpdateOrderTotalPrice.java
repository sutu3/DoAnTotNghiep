package com.example.order.Utils;

import com.example.order.Module.ExportOrder;
import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ExportOrderRepo;
import com.example.order.Repo.ImportOrderRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
@RequiredArgsConstructor
@Component
public class UpdateOrderTotalPrice {
    private final ImportOrderRepo importOrderRepo;
    private final ExportOrderRepo exportOrderRepo;

    // Sửa thành public và non-static để có thể sử dụng
    public void updateTotalPriceImport(ImportOrder importOrder) {
        BigDecimal totalPrice = importOrder.getImportItems().stream()
                .filter(item -> !item.getIsDeleted())
                .map(item -> item.getCostUnitBase().multiply(BigDecimal.valueOf(item.getRequestQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        importOrder.setTotalPrice(totalPrice);
        importOrderRepo.save(importOrder);
    }
    public void updateTotalPriceExport(ExportOrder exportOrder) {
        BigDecimal totalPrice = exportOrder.getExportItems().stream()
                .filter(item -> !item.getIsDeleted())
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        exportOrder.setTotalAmount(totalPrice);
        exportOrderRepo.save(exportOrder);
    }
}
