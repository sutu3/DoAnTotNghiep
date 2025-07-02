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

        String publicValue = generatePublicValue(image.getOriginalFilename());
        String extension = getFileName(image.getOriginalFilename())[1];

        log.info("Uploading to Cloudinary as bytes...");
        log.info("Public Value: {}", publicValue);
        log.info("Extension: {}", extension);

        // Upload từ bytes, không ghi ra đĩa
        var uploadResult = cloudinary.uploader().upload(
                image.getBytes(),
                ObjectUtils.asMap("public_id", publicValue)
        );

        String fileUrl = cloudinary.url().generate(publicValue + "." + extension);

        // Lưu DB
        return imageRepo.save(Image.builder()
                .publicId(publicValue)
                .urlImage(fileUrl)
                .build());
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
