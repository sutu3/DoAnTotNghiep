package com.example.productservice.Dto.Requests;

import lombok.Builder;

@Builder
public record GroupUnitRequest(
                String groupName,
                String description,
                Float baseUnitRatio,
                String unitType) {
}
