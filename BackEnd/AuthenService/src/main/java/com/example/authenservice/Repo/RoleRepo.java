package com.example.authenservice.Repo;

import com.example.authenservice.Modal.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepo extends JpaRepository<Role,String> {
    Optional<Role> findByRoleName(String name);
    Boolean existsByRoleName(String name);
}
