package com.example.productservice.Service;

import com.example.productservice.Dto.Requests.UnitRequest;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Form.UnitForm;
import com.example.productservice.Model.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UnitService {
    Page<UnitResponse> getAll(Pageable pageable);
    Page<UnitResponse> getAllByGroupUnitName(String GroupUnitName,Pageable pageable);
    Unit getById(String id);
    UnitResponse getByIdResponse(String id);
    UnitResponse createUnit(UnitRequest request);
    UnitResponse updateUnit(UnitForm update,String unitId);
    Unit getByShortNameAndUnitName(String shortName,String unitName);

    void deleteUnit(String unitId);
}
