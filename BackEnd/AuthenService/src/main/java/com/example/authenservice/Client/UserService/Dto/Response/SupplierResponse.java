package com.example.authenservice.Client.UserService.Dto.Response;

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

}
