package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.Costumer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CostumerRepo extends JpaRepository<Costumer,String> {
    boolean existsByEmailAndPhoneNumber(String email,String phoneNumber);
}
