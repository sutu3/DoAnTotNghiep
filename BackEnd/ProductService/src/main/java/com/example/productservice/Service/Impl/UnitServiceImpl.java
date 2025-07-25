package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Dto.Requests.UnitRequest;
import com.example.productservice.Dto.Responses.Unit.UnitNameResponse;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;
import com.example.productservice.Form.UnitForm;
import com.example.productservice.Mapper.UnitMapper;
import com.example.productservice.Model.GroupUnit;
import com.example.productservice.Model.Unit;
import com.example.productservice.Repo.UnitRepo;
import com.example.productservice.Service.GroupUnitService;
import com.example.productservice.Service.UnitService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UnitServiceImpl implements UnitService {
    UnitMapper unitMapper;
    UnitRepo unitRepo;
    UserController userController;
    GroupUnitService groupUnitService;

    @Override
    public Page<UnitResponse> getAll(Pageable pageable) {
        return unitRepo.findAllByIsDeleted(false,pageable).map((unit -> {
            UserResponse userResponse=userController
                    .getUser(unit.getCreateByUser()).getResult();
            UnitResponse unitResponse=unitMapper.toResponse(unit);
            return unitMapper.updateCreateByUser(unitResponse,userResponse);
        }));
    }

    @Override
    public Page<UnitResponse> getAllByGroupUnitName(String GroupUnitName, Pageable pageable) {
        groupUnitService.getByGroupUnitName(GroupUnitName);
        return unitRepo.findAllByGroupUnit_GroupNameAndIsDeleted(GroupUnitName,false,pageable).map((unit -> {
            UserResponse userResponse=userController
                    .getUser(unit.getCreateByUser()).getResult();
            UnitResponse unitResponse=unitMapper.toResponse(unit);
            return unitMapper.updateCreateByUser(unitResponse,userResponse);
        }));
    }

    @Override
    public Unit getById(String id) {
        return unitRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.UNIT_NOT_FOUND));
    }

    @Override
    public List<UnitNameResponse> getAllUnitName() {
        return unitRepo.findAllByIsDeleted(false)
                .stream().map(unitMapper::toNameResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UnitResponse getByIdResponse(String id) {
        Unit unit = getById(id);
        UserResponse userResponse=userController
                .getUser(unit.getCreateByUser()).getResult();
        UnitResponse unitResponse=unitMapper.toResponse(unit);
        return unitMapper.updateCreateByUser(unitResponse,userResponse);
    }

    @Override
    public UnitResponse createUnit(UnitRequest request) {
        var idUser=GetCurrentUserId.getCurrentUserId();
        UserResponse userResponse=userController
                .getUser(idUser).getResult();
        GroupUnit groupUnit=groupUnitService.getById(request.groupUnit());
        Optional<Unit> existing=unitRepo.findByShortNameAndUnitName(request.shortName(), request.unitName());
        if(existing.isPresent()){
            Unit unit=existing.get();
            if(!unit.getIsDeleted()){
                throw new AppException(ErrorCode.UNIT_EXISTS);
            }
            unitMapper.updateEntity(unit,request);
            unit.setIsDefault(false);
            unit.setRatioToBase(request.RatioToBase());
            unit.setGroupUnit(groupUnit);
            unit.setCreateByUser(idUser);
            UnitResponse unitResponse=unitMapper.toResponse(unitRepo.save(unit));
            return unitMapper.updateCreateByUser(unitResponse,userResponse);        }
        Unit unit=unitMapper.toEntity(request);
        unit.setRatioToBase(request.RatioToBase());
        unit.setIsDeleted(false);
        unit.setIsDefault(false);
        unit.setGroupUnit(groupUnit);
        unit.setCreateByUser(idUser);
        UnitResponse unitResponse=unitMapper.toResponse(unitRepo.save(unit));
        return unitMapper.updateCreateByUser(unitResponse,userResponse);
    }

    @Override
    public UnitResponse updateUnit(UnitForm update, String unitId) {
        UserResponse userResponse=userController.getUser(update.createByUser()).getResult();
        Unit unit=getById(unitId);
        Optional<Unit> existing=unitRepo.findByShortNameAndUnitName(update.shortName(), update.unitName());
        if(existing.isPresent()){
            throw new AppException(ErrorCode.UNIT_EXISTS);
        }
        unitMapper.update(unit,update);
        UnitResponse unitResponse=unitMapper.toResponse(unitRepo.save(unit));
        return unitMapper.updateCreateByUser(unitResponse,userResponse);
    }

    @Override
    public Unit getByShortNameAndUnitName(String shortName, String unitName) {
        return unitRepo.findByShortNameAndUnitName(shortName, unitName)
                .orElseThrow(()->new AppException(ErrorCode.UNIT_NOT_FOUND));
    }

    @Override
    public void deleteUnit(String unitId) {
        Unit unit = getById(unitId);
        unit.setIsDeleted(true);
        unit.setDeletedAt(LocalDateTime.now());
        unitRepo.save(unit);
    }
}
