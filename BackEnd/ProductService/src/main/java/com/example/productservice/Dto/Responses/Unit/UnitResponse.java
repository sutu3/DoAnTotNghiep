package com.example.productservice.Dto.Responses.Unit;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponseNoList;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UnitResponse {
    String unitID;
    String unitName;
    String shortName;
    Float ratioToBase;
    Boolean isDefault;
    GroupUnitResponseNoList groupUnit;
    UserResponse createByUser;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
