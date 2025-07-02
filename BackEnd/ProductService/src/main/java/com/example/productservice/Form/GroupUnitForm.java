package com.example.productservice.Form;

import lombok.Builder;

@Builder
public record GroupUnitForm(
                String groupName,
                String description,
                Float baseUnitRatio,
                String createByUser
) {
}
