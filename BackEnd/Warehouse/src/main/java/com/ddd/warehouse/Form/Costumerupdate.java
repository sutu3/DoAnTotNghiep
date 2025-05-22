package com.ddd.warehouse.Form;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Costumerupdate(
    String costumerName,
    String email,
    String phoneNumber

){
}
