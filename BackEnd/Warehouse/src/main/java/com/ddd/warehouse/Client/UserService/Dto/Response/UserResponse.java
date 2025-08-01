package com.ddd.warehouse.Client.UserService.Dto.Response;

import com.ddd.warehouse.Dto.Response.Warehouse.WarehousesResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserResponse {
    String userId;
    String userName;
    String email;
    String urlImage;
    WarehousesResponse warehouses;
}
