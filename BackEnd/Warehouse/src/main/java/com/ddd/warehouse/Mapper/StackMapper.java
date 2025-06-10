package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Form.StackForm;
import com.ddd.warehouse.Module.Stacks;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StackMapper {
    @Mapping(target = "warehouse",ignore = true)
    Stacks toEntity(StackRequest request);
    StackResponse toResponse(Stacks entity);
    void update(@MappingTarget Stacks entity, StackForm update);

}
