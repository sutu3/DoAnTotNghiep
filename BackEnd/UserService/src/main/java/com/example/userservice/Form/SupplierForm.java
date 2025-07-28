package com.example.userservice.Form;

import lombok.Builder;

@Builder
public record SupplierForm(
        String urlSupplier,
        String supplierName,
        String email,
        String phoneNumber,
        String address,
        String district,
        String street,
        String country) {
}
