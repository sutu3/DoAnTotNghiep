package com.example.authenservice.Repo;

import com.example.authenservice.Modal.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepo extends JpaRepository<User,String> {
    Page<User> findByIsDeleted(Pageable pageable,Boolean isDeleted);
    Boolean existsByEmail(String email);
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
    Optional<User> findByUsername(String username);
}
