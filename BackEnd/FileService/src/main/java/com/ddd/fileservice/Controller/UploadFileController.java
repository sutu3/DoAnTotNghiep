package com.ddd.fileservice.Controller;

import com.ddd.fileservice.Response.ImageResponse;
import com.ddd.fileservice.Service.ImageService;
import com.ddd.fileservice.Service.UploadImageFileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/images")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://26.144.191.229:5173",
        "http://26.225.63.179:5173"
})
public class UploadFileController {

    UploadImageFileService uploadFile;
    ImageService imageService;

    @Operation(summary = "Upload image to Cloudinary")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload successful"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImageResponse uploadFileImage(@RequestParam("file") MultipartFile file) throws IOException {
        var uploadedImage = uploadFile.uploadImage(file);
        return imageService.getById(String.valueOf(uploadedImage.getIdImage()));
    }
}
