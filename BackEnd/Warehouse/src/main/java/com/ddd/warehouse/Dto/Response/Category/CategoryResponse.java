package com.ddd.warehouse.Dto.Response.Category;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;


@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryResponse(
        String categoryId,
        String categoryName,
        String description
){
}
