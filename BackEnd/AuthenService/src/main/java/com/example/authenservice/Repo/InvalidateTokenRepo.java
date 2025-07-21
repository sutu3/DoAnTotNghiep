package com.example.authenservice.Repo;

import com.example.authenservice.Modal.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidateTokenRepo extends JpaRepository<InvalidateToken,String> {
}
