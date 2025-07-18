package com.example.redisservice.Client.UserService.Dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SupplierResponse {
    String supplierId;
    String urlSupplier;
    String supplierName;
    String email;
    String status;
    String phoneNumber;
    String address;
    String district;
    String street;
    String country;

}
