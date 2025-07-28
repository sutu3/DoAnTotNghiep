package com.example.order.Repo;

import com.example.order.Module.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptItemRepo extends JpaRepository<ReceiptItem, String> {
    List<ReceiptItem> findByWarehouseReceipt_ReceiptIdAndIsDeleted(String receiptId, Boolean isDeleted);
}
