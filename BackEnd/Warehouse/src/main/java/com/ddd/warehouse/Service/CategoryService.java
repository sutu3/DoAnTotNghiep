package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.CategoryRequest;
import com.ddd.warehouse.Dto.Response.Category.CategoryResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.CategoryUpdate;
import com.ddd.warehouse.Mapper.CategoryMapper;
import com.ddd.warehouse.Module.Category;
import com.ddd.warehouse.Repo.CategoryRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CategoryService {
    CategoryRepo categoryRepo;
    CategoryMapper categoryMapper;

    public List<CategoryResponse> getall(){
        return categoryRepo.findAll().stream()
                .map(categoryMapper::toResponse).collect(Collectors.toList());
    }
    public CategoryResponse findById(String id){
        Category Category= categoryRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(Category);
    }
    public CategoryResponse createCategory(CategoryRequest request){
        if(categoryRepo.existsByCategoryName(request.categoryName())){
            throw new AppException(ErrorCode.CATEGORY_EXIST);
        }
        Category Category= categoryMapper.toEntity(request);
        Category.setIsDeleted(false);
        return categoryMapper.toResponse(categoryRepo.save(Category));
    }
    public CategoryResponse updateCategory(CategoryUpdate update,String id){
        if(categoryRepo.existsByCategoryName(update.categoryName())){
            throw new AppException(ErrorCode.CATEGORY_EXIST);
        }
        Category category= categoryRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        categoryMapper.updateCategory(category,update);
        return categoryMapper.toResponse(categoryRepo.save(category));
    }
    public String deletedCategory(String id){
        Category Category= categoryRepo.findById(id).orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        Category.setIsDeleted(true);
        Category.setDeletedAt(LocalDateTime.now());
        categoryRepo.save(Category);
        return "Deleted SuccessFull";

    }
}
