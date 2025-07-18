package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Dto.Requests.GroupUnitRequest;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;
import com.example.productservice.Form.GroupUnitForm;
import com.example.productservice.Mapper.GroupUnitMapper;
import com.example.productservice.Model.GroupUnit;
import com.example.productservice.Repo.GroupUnitRepo;
import com.example.productservice.Service.GroupUnitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class GroupUnitServiceImpl implements GroupUnitService {
    GroupUnitRepo groupUnitRepo;
    UserController userController;
    GroupUnitMapper groupUnitMapper;

    @Override
    public Page<GroupUnitResponse> getAll(Pageable pageable) {
        return groupUnitRepo.findAllByIsDeleted(false,pageable).map(groupUnit -> {
            UserResponse userResponse=userController.getUser(groupUnit.getCreateByUser()).getResult();
            GroupUnitResponse groupUnitResponse=groupUnitMapper.toResponse(groupUnit);
            return groupUnitMapper.updateCreateByUser(groupUnitResponse,userResponse);
        });
    }
    @Override
    public GroupUnitResponse getByIdResponse(String id) {
        GroupUnitResponse groupUnitResponse=groupUnitMapper.toResponse(getById(id));
        UserResponse userResponse=userController
                .getUser(groupUnitResponse.getCreateByUser().getUserId()).getResult();
        return groupUnitMapper.updateCreateByUser(groupUnitResponse,userResponse);
    }

    @Override
    public GroupUnit getById(String id) {
        return groupUnitRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.GROUP_UNIT_NOT_FOUND));
    }

    @Override
    public GroupUnitResponse createGroupUnit(GroupUnitRequest request) {
        var idUser=GetCurrentUserId.getCurrentUserId();
        UserResponse userResponse=userController
                .getUser(idUser).getResult();
        Optional<GroupUnit> existing=groupUnitRepo.findByGroupNameAndIsDeleted(
                request.groupName(), false);
        if(existing.isPresent()){
            GroupUnit groupUnit=existing.get();
            if(!groupUnit.getIsDeleted()){
                throw new AppException(ErrorCode.GROUP_UNIT_EXISTS);
            }
            groupUnit.setIsDeleted(false);
            groupUnit.setCreateByUser(idUser);
            groupUnitRepo.save(groupUnit);
            GroupUnitResponse response=groupUnitMapper.toResponse(groupUnit);
            return groupUnitMapper.updateCreateByUser(response,userResponse);
        }
        GroupUnit groupUnit=groupUnitMapper.toEntity(request);
        groupUnit.setIsDeleted(false);
        GroupUnitResponse groupUnitResponse=groupUnitMapper
                .toResponse(groupUnitRepo.save(groupUnit));
        return groupUnitMapper.updateCreateByUser(groupUnitResponse,userResponse);
    }

    @Override
    public GroupUnitResponse updateGroupUnit(GroupUnitForm update, String id) {
        UserResponse userResponse=userController
                .getUser(update.createByUser()).getResult();
        getByGroupUnitName(update.groupName());
        GroupUnit groupUnit=getById(id);
        groupUnitMapper.update(groupUnit,update);
        GroupUnitResponse groupUnitResponse=groupUnitMapper.toResponse(groupUnitRepo.save(groupUnit));
        return groupUnitMapper.updateCreateByUser(groupUnitResponse,userResponse);
    }

    @Override
    public void deleteGroupUnit(String id) {
        GroupUnit groupUnit=getById(id);
        groupUnit.setIsDeleted(true);
        groupUnit.setDeletedAt(LocalDateTime.now());
        groupUnitRepo.save(groupUnit);
    }

    @Override
    public GroupUnit getByGroupUnitName(String groupUnitName) {
        return groupUnitRepo.findByGroupNameAndIsDeleted(groupUnitName,false)
                .orElseThrow(()->new AppException(ErrorCode.GROUP_UNIT_NOT_FOUND));
    }
}
