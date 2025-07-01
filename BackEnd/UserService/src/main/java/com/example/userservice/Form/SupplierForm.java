package com.example.userservice.Form;

import lombok.Builder;

@Builder
public record SupplierForm(
        String supplierName,
        String email,
        String phoneNumber,
        String address,

        String warehouses) {
}
