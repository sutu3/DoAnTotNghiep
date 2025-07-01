package com.example.userservice.Dto.Responses.Supplier;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierResponse {
    String supplierId;
    String urlSupplier;
    String supplierName;
    String email;
    String phoneNumber;
    String address;
    String district;
    String street;
    String country;
}
