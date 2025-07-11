package com.example.order.Form;

import lombok.Builder;

@Builder
public record UpdateQuantityRequest(
        Integer realityQuantity
) {
}
