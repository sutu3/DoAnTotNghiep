package com.example.redisservice.Client.WarehouseService.Dto.Responses.Bin;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BinResponse{
    String binId;
    String binCode;
    Integer capacity;
    Integer currentOccupancy;
    String status;

}
