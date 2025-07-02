package com.ddd.fileservice.Repo;


import com.ddd.fileservice.Entity.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
public interface UploadImageFile  {
    Image uploadImage(MultipartFile image) throws IOException;
}
