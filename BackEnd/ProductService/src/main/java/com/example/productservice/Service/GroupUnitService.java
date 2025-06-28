package com.example.productservice.Service;

import com.example.productservice.Dto.Requests.GroupUnitRequest;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponse;
import com.example.productservice.Form.GroupUnitForm;
import com.example.productservice.Model.GroupUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface GroupUnitService {
    Page<GroupUnitResponse> getAll(Pageable pageable);
    GroupUnitResponse getByIdResponse(String id);
    GroupUnit getById(String id);
    GroupUnitResponse createGroupUnit(GroupUnitRequest request);
    GroupUnitResponse updateGroupUnit(GroupUnitForm update,String id);
    void deleteGroupUnit(String id);
    GroupUnit getByGroupUnitName(String groupUnitName);
}
