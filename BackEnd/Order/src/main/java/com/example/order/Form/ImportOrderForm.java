package com.example.order.Form;

import lombok.Builder;

@Builder
public record ImportOrderForm(
        String note
        ) {
}
