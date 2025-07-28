package com.example.userservice.Service.Impl;

import com.example.userservice.Dto.Request.SupplierRequest;
import com.example.userservice.Dto.Responses.Supplier.SupplierResponse;
import com.example.userservice.Enum.StatusSupplier;
import com.example.userservice.Exception.AppException;
import com.example.userservice.Exception.ErrorCode;
import com.example.userservice.Form.SupplierForm;
import com.example.userservice.Mapper.SupplierMapper;
import com.example.userservice.Model.Supplier;
import com.example.userservice.Repo.SupplierRepo;
import com.example.userservice.Service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class SupplierServiceImpl implements SupplierService {
    private final SupplierMapper supplierMapper;
    private final SupplierRepo supplierRepo;

    @Override
    public Page<SupplierResponse> getAll(Pageable pageable) {
        return supplierRepo.findAllByIsDeleted( false, pageable)
                .map(supplierMapper::toResponse);
    }

    @Override
    public List<SupplierResponse> getALlList() {
        return supplierRepo.findAllByIsDeleted( false).stream()
                .map(supplierMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Supplier getById(String supplierId) {
        return supplierRepo.findById(supplierId).orElseThrow(
                ()->new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
    }

    @Override
    public SupplierResponse getByIdResponse(String supplierId) {
        return supplierMapper.toResponse(getById(supplierId));
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest supplierRequest) {
        Optional<Supplier> existing=supplierRepo.findAllByEmailAndPhoneNumber(
                supplierRequest.email(),
                supplierRequest.phoneNumber());
        var idUser=GetCurrentUserId.getCurrentUserId();
        if(existing.isPresent()){
            Supplier supplier=existing.get();
            if(!supplier.getIsDeleted()){
                throw new AppException(ErrorCode.SUPPLIER_EXIST);
            }
            supplierMapper.updateSupplierRequest(supplier,supplierRequest);
            supplier.setIsDeleted(false);
            supplierRepo.save(supplier);
            return supplierMapper.toResponse(supplier);
        }
        Supplier supplier=supplierMapper.toEntity(supplierRequest);
        supplier.setStatus(StatusSupplier.Supplier);
        supplier.setIsDeleted(false);
        supplierRepo.save(supplier);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    public SupplierResponse updateSupplier(SupplierForm update, String supplierId) {
        Supplier supplier=getById(supplierId);
        supplierMapper.updateSupplier(supplier,update);
        supplier.setCountry(update.country());
        Supplier supplierUpdate=supplierRepo.save(supplier);
        return supplierMapper.toResponse(supplierUpdate);
    }

    @Override
    public void deleteSupplier(String supplierId) {
        Supplier supplier=supplierRepo.getById(supplierId);
        supplier.setIsDeleted(true);
        supplier.setDeletedAt(LocalDateTime.now());
        supplierRepo.save(supplier);
    }
}
