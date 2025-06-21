package com.example.userservice.Repo;

import com.example.userservice.Model.Users;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users,String>, JpaSpecificationExecutor<Users> {
    Page<Users> findByUserName(String s,Pageable pageable);
    boolean existsByPhoneNumberAndEmail(String phoneNumber, String email);
    Page<Users> findByWarehouses(String warehouseId, Pageable pageable);
}

