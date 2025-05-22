package com.ddd.warehouse.Dto.Request;

import com.ddd.warehouse.Enum.Userenum;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserRequest(
    String userName,
    String fullName,
    String email,
    String password,
    String phoneNumber
    // thiếu warehouseId
    //thiếu roleId
){
}
