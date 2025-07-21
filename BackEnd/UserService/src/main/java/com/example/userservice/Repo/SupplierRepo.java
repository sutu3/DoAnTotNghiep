package com.example.userservice.Repo;

import com.example.userservice.Model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier,String>, JpaSpecificationExecutor<Supplier> {
    Optional<Supplier> findAllByEmailAndPhoneNumber(String email,  String phoneNumber);
    List<Supplier> findAllByIsDeleted(boolean deleted);
    Page<Supplier> findAllByIsDeleted(boolean deleted, Pageable pageable);
}
