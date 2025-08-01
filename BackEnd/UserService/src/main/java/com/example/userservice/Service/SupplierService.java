package com.example.userservice.Service;

import com.example.userservice.Dto.Request.SupplierRequest;
import com.example.userservice.Dto.Responses.Supplier.SupplierResponse;
import com.example.userservice.Form.SupplierForm;
import com.example.userservice.Model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SupplierService {
    Page<SupplierResponse> getAll(Pageable pageable);
    List<SupplierResponse> getALlList();
    Supplier getById(String supplierId);
    SupplierResponse getByIdResponse(String supplierId);
    SupplierResponse createSupplier(SupplierRequest supplierRequest);
    SupplierResponse updateSupplier(SupplierForm update,String supplierId);
    void deleteSupplier(String supplierId);
}
