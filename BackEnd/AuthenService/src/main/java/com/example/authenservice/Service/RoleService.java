package com.example.authenservice.Service;

import com.example.authenservice.Dtos.Request.RoleRequest;
import com.example.authenservice.Dtos.Response.RoleResponse;
import com.example.authenservice.Modal.Role;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface RoleService {
    List<RoleResponse> getall();
    RoleResponse PostRole(RoleRequest request);
    void deleteRole(String name);
    Role getRole(String name);
}
