package com.ddd.fileservice.Repo;

import com.ddd.fileservice.Entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepo extends JpaRepository<Image,String> {
}
