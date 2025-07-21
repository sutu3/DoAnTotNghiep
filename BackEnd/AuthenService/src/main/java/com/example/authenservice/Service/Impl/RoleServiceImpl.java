package com.example.authenservice.Service.Impl;

import com.example.authenservice.Dtos.Request.RoleRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Exception.AppException;
import com.example.authenservice.Exception.ErrorCode;
import com.example.authenservice.Mapper.RoleMapper;
import com.example.authenservice.Modal.Role;
import com.example.authenservice.Repo.RoleRepo;
import com.example.authenservice.Service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleServiceImpl implements RoleService {
    RoleMapper roleMapper;
    RoleRepo roleRepo;
    @Override
    public List<RoleResponse> getall() {
        return roleRepo.findAll().stream()
                .map(roleMapper::toResponse).collect(Collectors.toList());    }

    @Override
    public RoleResponse PostRole(RoleRequest request) {
        Role role=roleMapper.toEntity(request);
        if(roleRepo.existsByRoleName(request.roleName())){
            throw new AppException(ErrorCode.ROLE_IS_EXITED);
        }
        role.setIsDeleted(false);
        return roleMapper.toResponse(roleRepo.save(role));    }

    @Override
    public void deleteRole(String name) {
        Role role=getRole(name);
        role.setIsDeleted(true);
        role.setDeletedAt(LocalDateTime.now());
        roleRepo.save(role);
    }

    @Override
    public Role getRole(String name) {
        return roleRepo.findByRoleName(name)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
    }
}
