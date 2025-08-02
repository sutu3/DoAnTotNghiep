package com.ddd.fileservice.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ddd.fileservice.Entity.Image;
import com.ddd.fileservice.Repo.ImageRepo;
import com.ddd.fileservice.Repo.UploadImageFile;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UploadImageFileService implements UploadImageFile {
    Cloudinary cloudinary;
    ImageRepo imageRepo;
    @Override
    public Image uploadImage(MultipartFile image) throws IOException {
        assert image.getOriginalFilename() != null;

        String originalFilename = image.getOriginalFilename();
        String extension = getFileExtension(originalFilename).toLowerCase();
        String publicId = generatePublicValue(originalFilename);

        log.info("Uploading file: {}", originalFilename);
        log.info("Detected extension: {}", extension);
        log.info("Public ID: {}", publicId);

        // Cấu hình upload
        var uploadOptions = ObjectUtils.asMap(
                "public_id", publicId,
                "resource_type", "auto" // Cho phép Cloudinary tự nhận diện loại file
        );

        // Nếu là PDF, yêu cầu convert sang PNG
        if (extension.equals("pdf")) {
            uploadOptions.put("format", "png"); // Chuyển đổi PDF thành PNG
            uploadOptions.put("pages", 1); // Mặc định chỉ lấy trang đầu tiên
        }

        var uploadResult = cloudinary.uploader().upload(image.getBytes(), uploadOptions);

        // Lấy extension thực tế sau khi upload
        String finalExtension = extension.equals("pdf") ? "png" : extension;
        String fileUrl = cloudinary.url().generate(publicId + "." + finalExtension);

        // Lưu DB
        return imageRepo.save(Image.builder()
                .publicId(publicId)
                .urlImage(fileUrl)
                .build());
    }
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("File name does not contain an extension.");
        }
        return filename.substring(lastDotIndex + 1);
    }
    private File conver(MultipartFile file) {
        assert file.getOriginalFilename() != null;
        File conVertFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), ".", getFileName(file.getOriginalFilename())[1]));
        try(InputStream is=file.getInputStream()) {
            Files.copy(is,conVertFile.toPath());
        }catch (IOException e) {
            throw new RuntimeException(e);
        }
        return conVertFile;
    }
    public String generatePublicValue(String originalFilename){
        String[] split = getFileName(originalFilename);
        return StringUtils.join(UUID.randomUUID().toString() + "." + split[0]);
    }
    public String[] getFileName(String filename){
        return filename.split("\\.");
    }
    public void cleanDisk(File file){
        try {
            log.info(file.toPath().toString());
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
