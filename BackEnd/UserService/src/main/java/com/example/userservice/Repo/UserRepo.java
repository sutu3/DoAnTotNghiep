package com.example.userservice.Repo;

import com.example.userservice.Model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<Users,String>, JpaSpecificationExecutor<Users> {
    Page<Users> findByUserName(String s,Pageable pageable);
    Optional<Users> findByUserName(String s);
    Optional<Users> findByEmail(String email);
    boolean existsByPhoneNumberAndEmail(String phoneNumber, String email);
    Page<Users> findByWarehouses(String warehouseId, Pageable pageable);
    @Query("SELECT u FROM Users u WHERE u.warehouses = :warehouseId " +
            "AND u.status = 'Active' AND u.isDeleted = false")
    List<Users> findActiveUsersByWarehouse(@Param("warehouseId") String warehouseId);
}

