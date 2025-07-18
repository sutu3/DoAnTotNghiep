package com.example.productservice.Dto.Requests;

import lombok.Builder;

@Builder
public record UnitRequest(
        String unitName,
        String shortName,
        Float RatioToBase,
        Boolean IsDefault,
        String groupUnit) {
}
