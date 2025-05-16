package com.ddd.warehouse.Mapper;

import com.ddd.warehouse.Dto.Request.CostumerRequest;
import com.ddd.warehouse.Dto.Response.Costumer.CostumerResponse;
import com.ddd.warehouse.Form.AddressUpdate;
import com.ddd.warehouse.Form.Costumerupdate;
import com.ddd.warehouse.Module.Costumer;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CostumerMapper {
    Costumer toEntity(CostumerRequest request);
    CostumerResponse toResponse(Costumer entity);
    void updateCostumer(@MappingTarget Costumer entity, Costumerupdate update);
    void updateAddressCostumer(@MappingTarget Costumer entity, AddressUpdate update);
}
