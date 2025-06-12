package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Form.BinForm;
import com.ddd.warehouse.Module.Bins;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BinMapper {
    @Mapping(target = "warehouse",ignore = true)
    @Mapping(target = "stack",ignore = true)
    Bins toEntity(BinRequest request);
    BinResponse toResponse(Bins entity);
    void update(@MappingTarget Bins entity, BinForm update);

}
