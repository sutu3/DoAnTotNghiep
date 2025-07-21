package com.ddd.warehouse.Client.UserService.Dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IdWarehouseResponse {
    String warehouseId;
}
