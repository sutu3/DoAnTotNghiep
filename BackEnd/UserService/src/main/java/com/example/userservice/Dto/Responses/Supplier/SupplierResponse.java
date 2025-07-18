package com.example.userservice.Dto.Responses.Supplier;

import com.example.userservice.Enum.StatusSupplier;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
    StatusSupplier status;
    String phoneNumber;
    String address;
    String district;
    String street;
    String country;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
