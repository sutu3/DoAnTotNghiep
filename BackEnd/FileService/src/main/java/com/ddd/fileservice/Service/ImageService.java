package com.ddd.fileservice.Service;


import com.ddd.fileservice.Entity.Image;
import com.ddd.fileservice.Exception.AppException;
import com.ddd.fileservice.Exception.ErrorCode;
import com.ddd.fileservice.Mapper.ImageMapper;
import com.ddd.fileservice.Repo.ImageRepo;
import com.ddd.fileservice.Response.ImageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class ImageService {
    ImageRepo imageRepository;
    ImageMapper imageMapper;

    public List<Image> getall(){
        return imageRepository.findAll();
    }
    public ImageResponse getById(String id) {
        // Ném ra ngoại lệ nếu không tìm thấy hình ảnh
        return imageMapper.toImageResponse(imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOTFOUND)));
    }
}
