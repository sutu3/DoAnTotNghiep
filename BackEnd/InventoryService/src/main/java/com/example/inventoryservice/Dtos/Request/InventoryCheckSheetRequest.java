package com.example.inventoryservice.Dtos.Request;

import com.example.inventoryservice.Enum.CheckSheetStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryCheckSheetRequest {
    @NotBlank
    String checkSheetNumber;
    @NotBlank
    String warehouse;
    String notes;
    List<InventoryCheckDetailRequest> checkDetails;
}
