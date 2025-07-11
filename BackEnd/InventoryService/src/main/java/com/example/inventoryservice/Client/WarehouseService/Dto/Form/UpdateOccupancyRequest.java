package com.example.inventoryservice.Client.WarehouseService.Dto.Form;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOccupancyRequest{
    Integer occupancyChange;
}
