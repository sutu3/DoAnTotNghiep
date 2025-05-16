package com.ddd.warehouse.Repo;

import com.ddd.warehouse.Module.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,String> {
    boolean existsByEmailAndPhoneNumber(String email,String phoneNumber);
}
