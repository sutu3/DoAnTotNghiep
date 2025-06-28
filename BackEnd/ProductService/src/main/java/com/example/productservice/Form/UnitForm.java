package com.example.productservice.Form;

import lombok.Builder;

@Builder
public record UnitForm(
        String unitName,
        String shortName,
        Float RatioToBase,
        Boolean IsDefault,
        String createByUser
) {
}
