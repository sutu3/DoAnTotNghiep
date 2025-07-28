package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Dto.Requests.CategoryRequest;
import com.example.productservice.Dto.Responses.Category.CategoryNameResponse;
import com.example.productservice.Dto.Responses.Category.CategoryResponse;
import com.example.productservice.Exception.AppException;
import com.example.productservice.Exception.ErrorCode;
import com.example.productservice.Form.CategoryForm;
import com.example.productservice.Mapper.CategoryMapper;
import com.example.productservice.Model.Category;
import com.example.productservice.Repo.CategoryRepo;
import com.example.productservice.Service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    CategoryRepo categoryRepo;
    CategoryMapper categoryMapper;
    private final AsyncServiceImpl asyncServiceImpl;

    @Override
    public Page<CategoryResponse> getAll(Pageable pageable) {
        return categoryRepo.findAllByIsDeleted(false,pageable)
                .map(this::enrich);
    }

    @Override
    public List<CategoryNameResponse> getAllCategoryName() {
        return categoryRepo.findAllByIsDeleted(false)
                .stream().map(categoryMapper::toNameResponse).collect(Collectors.toList());
    }

    @Override
    public Category getByName(String name) {
        return categoryRepo.findByCategoryNameAndIsDeleted(name,false)
                .orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public CategoryResponse getByNameResponse(String name) {
        Category category=getByName(name);
        return enrich(category);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        var idUser=GetCurrentUserId.getCurrentUserId();

        Optional<Category> existing = categoryRepo
                .findByCategoryName(request.categoryName());
        if(existing.isPresent()){
            Category category=existing.get();
            if(!category.getIsDeleted()){
                throw  new AppException(ErrorCode.CATEGORY_EXISTS);
            }
            category.setIsDeleted(false);
            category.setCreateByUser(idUser);
            category.setDescription(request.description());
            Category savedCategory = categoryRepo.save(category);
            return enrich(savedCategory);
        }
        Category category=categoryMapper.toEntity(request);
        category.setIsDeleted(false);
        category.setCreateByUser(idUser);
        Category savedCategory = categoryRepo.save(category);
        return enrich(savedCategory);
    }

    @Override
    public void DeleteCategory(String id) {
        Category category=getById(id);
        category.setIsDeleted(true);
        category.setDeletedAt(LocalDateTime.now());
        categoryRepo.save(category);
    }

    @Override
    public Category getById(String id) {
        return categoryRepo.findByCategoryIdAndIsDeleted(id,false)
                .orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public CategoryResponse getByIdResponse(String id) {
        Category category=getById(id);
        return enrich(category);
    }

    @Override
    public CategoryResponse updateCategory(CategoryForm update,String id) {
        Category category=getById(id);
        getByName(update.categoryName());
        categoryMapper.update(category,update);
        Category savedCategory = categoryRepo.save(category);
        return enrich(savedCategory);
    }

    @Override
    public CategoryResponse enrich(Category category) {
        CompletableFuture<UserResponse> userFuture = asyncServiceImpl.getUserAsync(category.getCreateByUser());
        CompletableFuture.allOf(userFuture).join();
        CategoryResponse categoryResponse=categoryMapper.toResponse(category);
        categoryResponse.setCreateByUser(userFuture.join());
        return categoryResponse;
    }
}
