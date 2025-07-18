package com.ddd.warehouse.Dto.Request;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record StackRequest(
        @NotBlank(message = "STACK_NAME_REQUIRED")
        @Size(min = 2, max = 50, message = "STACK_NAME_SIZE")
        String stackName,

        @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
        String description,

        @NotBlank(message = "Warehouse ID không được để trống")
        String warehouse,

        @Min(value = 1, message = "Số lượng bin phải lớn hơn 0")
        @Max(value = 100, message = "Số lượng bin không được vượt quá 100")
        int binQuantity

) {
}
