package com.example.order.Form;

import lombok.Builder;

@Builder
public record UpdateBinRequest(
        String binId
) {
}
