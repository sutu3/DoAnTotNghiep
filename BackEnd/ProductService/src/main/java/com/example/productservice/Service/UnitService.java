package com.example.productservice.Service;

import com.example.productservice.Dto.Requests.UnitRequest;
import com.example.productservice.Dto.Responses.Unit.UnitNameResponse;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Form.UnitForm;
import com.example.productservice.Model.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UnitService {
    Page<UnitResponse> getAll(Pageable pageable);
    Page<UnitResponse> getAllByGroupUnitName(String GroupUnitName,Pageable pageable);
    Unit getById(String id);
    List<UnitNameResponse> getAllUnitName();
    UnitResponse getByIdResponse(String id);
    @PreAuthorize("hasRole('MANAGER')")
    UnitResponse createUnit(UnitRequest request);
    @PreAuthorize("hasRole('MANAGER')")
    UnitResponse updateUnit(UnitForm update,String unitId);
    Unit getByShortNameAndUnitName(String shortName,String unitName);

    void deleteUnit(String unitId);
}
