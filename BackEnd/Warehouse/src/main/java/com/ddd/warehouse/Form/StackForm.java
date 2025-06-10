package com.ddd.warehouse.Form;

import lombok.Builder;

@Builder
public record StackForm(
        String stackName,
        String description
) {
}
