package com.ddd.warehouse.Dto.Response.Costumer;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CostumerResponse(
    String costumerId,
    String costumerName,
    String email,
    String phoneNumber,
    String address,
    String street,
    String district,
    String country,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Boolean isDeleted,
    LocalDateTime deletedAt
){
}
