package com.ddd.warehouse.Dto.Request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;


@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryRequest(
    String categoryName,
    String description
){
}
