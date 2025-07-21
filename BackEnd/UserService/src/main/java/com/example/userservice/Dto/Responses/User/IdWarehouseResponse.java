package com.example.userservice.Dto.Responses.User;

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
