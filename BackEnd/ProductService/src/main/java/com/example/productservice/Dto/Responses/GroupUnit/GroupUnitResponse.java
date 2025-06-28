package com.example.productservice.Dto.Responses.GroupUnit;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Enum.UnitType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupUnitResponse {
    String groupUnitID;
    String groupName;
    String description;
    Float baseUnitRatio;
    UnitType unitType;
    UserResponse createByUser;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
