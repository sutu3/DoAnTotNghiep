package com.example.userservice.Dto.Request;

import lombok.Builder;

@Builder
public record SupplierRequest(
        String urlSupplier,
        String supplierName,
        String email,
        String phoneNumber,
        String address,
        String district,
        String street,
        String country) {
}
