package com.example.productservice.Mapper;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Dto.Requests.UnitRequest;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Form.UnitForm;
import com.example.productservice.Model.Unit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UnitMapper {
    @Mapping(target = "groupUnit",ignore = true)
    Unit toEntity(UnitRequest request);
    @Mapping(target = "createByUser",ignore = true)
    UnitResponse toResponse(Unit unit);
    UnitResponse updateCreateByUser(@MappingTarget  UnitResponse unitResponse, UserResponse createByUser);
    void update(@MappingTarget  Unit unit, UnitForm update);
    @Mapping(target = "groupUnit",ignore = true)
    void updateEntity(@MappingTarget  Unit unit, UnitRequest request);

}
