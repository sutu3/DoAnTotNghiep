package com.ddd.fileservice.Repo;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
public interface UploadImageFile  {
    String uploadImage(MultipartFile image) throws IOException;
}
