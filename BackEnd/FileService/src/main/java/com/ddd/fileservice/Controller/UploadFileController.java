package com.ddd.fileservice.Controller;


import com.ddd.fileservice.Entity.Image;
import com.ddd.fileservice.Response.ApiResponse;
import com.ddd.fileservice.Response.ImageResponse;
import com.ddd.fileservice.Service.ImageService;
import com.ddd.fileservice.Service.UploadImageFileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/images")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@CrossOrigin(origins = {"http://localhost:5173","http://26.144.191.229:5173","http://26.225.63.179:5173"})
public class UploadFileController {
    UploadImageFileService uploadFile;
    ImageService imageService;
    @PostMapping("/upload")
    public ImageResponse uploadFileImage(@RequestParam("file") MultipartFile file) throws IOException, IOException {
        String idImage= String.valueOf(uploadFile.uploadImage(file));
        return imageService.getById(idImage);
    }
}
