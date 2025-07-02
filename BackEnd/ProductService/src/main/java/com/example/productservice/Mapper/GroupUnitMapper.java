package com.example.productservice.Mapper;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Dto.Requests.GroupUnitRequest;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponse;
import com.example.productservice.Form.GroupUnitForm;
import com.example.productservice.Model.GroupUnit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GroupUnitMapper {
    GroupUnit toEntity(GroupUnitRequest request);
    @Mapping(target = "createByUser",ignore = true)
    GroupUnitResponse toResponse(GroupUnit groupUnit);
    @Mapping(target = "createByUser",ignore = true)
    void update(@MappingTarget GroupUnit groupUnit, GroupUnitForm update);
    GroupUnitResponse updateCreateByUser(
            @MappingTarget GroupUnitResponse groupUnitResponse,
            UserResponse createByUser);
}
