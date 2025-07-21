package com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin;

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
public class BinResponse{
    String binId;
    String binCode;
    Integer capacity;
    Integer currentOccupancy;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
