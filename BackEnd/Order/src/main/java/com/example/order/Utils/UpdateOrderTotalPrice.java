package com.example.order.Utils;

import com.example.order.Module.ImportOrder;
import com.example.order.Repo.ImportOrderRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
@RequiredArgsConstructor
@Component
public class UpdateOrderTotalPrice {
    private final ImportOrderRepo importOrderRepo;

    // Sửa thành public và non-static để có thể sử dụng
    public void updateTotalPrice(ImportOrder importOrder) {
        BigDecimal totalPrice = importOrder.getImportItems().stream()
                .filter(item -> !item.getIsDeleted())
                .map(item -> item.getCostUnitBase().multiply(BigDecimal.valueOf(item.getRequestQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        importOrder.setTotalPrice(totalPrice);
        importOrderRepo.save(importOrder);
    }
}
