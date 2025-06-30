package com.ddd.fileservice.Mapper;


import com.ddd.fileservice.Entity.Image;
import com.ddd.fileservice.Response.ImageResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    /*Category toCategory(CategoryRequest request);
    @Mapping(source = "idcategory", target = "id")*/
    ImageResponse toImageResponse(Image image);
/*
    void updateCategory(@MappingTarget Category category, Category_Update update);
*/
}
