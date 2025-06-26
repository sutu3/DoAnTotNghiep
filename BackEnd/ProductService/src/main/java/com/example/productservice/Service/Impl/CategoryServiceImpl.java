package com.example.productservice.Service.Impl;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.UserService.UserController;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Client.WarehouseService.WarehouseController;
import com.example.productservice.Dto.Requests.CategoryRequest;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    CategoryRepo categoryRepo;
    CategoryMapper categoryMapper;
    WarehouseController warehouseController;
    private final UserController userController;

    @Override
    public Page<CategoryResponse> getAllByWarehouseId(Pageable pageable, String warehouses) {
        return categoryRepo.findAllByIsDeletedAndWarehouses(false, warehouses,pageable)
                .map(category -> {
                    WarehousesResponse warehousesResponse=warehouseController
                            .getWarehouse(category.getWarehouses())
                            .getResult();
                   UserResponse userResponse= userController
                           .getUser(category.getCategoryId())
                           .getResult();
                    CategoryResponse categoryResponse = categoryMapper.toResponse(category);
                    return categoryMapper.updateWarehouse(categoryResponse, warehousesResponse,userResponse);
                });
    }

    @Override
    public Category getByName(String name, String warehouses) {
        return categoryRepo.findByCategoryNameAndIsDeletedAndWarehouses(name,false,warehouses)
                .orElseThrow(()->new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public CategoryResponse getByNameResponse(String name, String warehouses) {
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(warehouses)
                .getResult();
        Category category=getByName(name,warehouses);
        CategoryResponse categoryResponse=categoryMapper.toResponse(category);
        UserResponse userResponse= userController
                .getUser(category.getCreateByUser())
                .getResult();
        return categoryMapper.updateWarehouse(categoryResponse,warehouse,userResponse);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        WarehousesResponse warehouse = warehouseController
                .getWarehouse(request.warehouses())
                .getResult();
        UserResponse userResponse= userController
                .getUser(request.createByUser())
                .getResult();
        Optional<Category> existing = categoryRepo
                .findByCategoryNameAndWarehouses(request.categoryName(),request.warehouses());
        if(existing.isPresent()){
            Category category=existing.get();
            if(!category.getIsDeleted()){
                throw  new AppException(ErrorCode.CATEGORY_EXISTS);
            }
            category.setIsDeleted(false);
            category.setDescription(request.description());
            CategoryResponse categoryResponse=categoryMapper.toResponse(categoryRepo.save(category));
            return categoryMapper.updateWarehouse(categoryResponse,warehouse,userResponse);
        }
        Category category=categoryMapper.toEntity(request);
        category.setIsDeleted(false);
        CategoryResponse categoryResponse=categoryMapper.toResponse(categoryRepo.save(category));
        return categoryMapper.updateWarehouse(categoryResponse,warehouse,userResponse);
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
        WarehousesResponse warehousesResponse=warehouseController
                .getWarehouse(category.getWarehouses())
                .getResult();
        UserResponse userResponse= userController
                .getUser(category.getCreateByUser())
                .getResult();
        CategoryResponse categoryResponse=categoryMapper
                .toResponse(category);
        return categoryMapper.updateWarehouse(categoryResponse,warehousesResponse,userResponse);
    }

    @Override
    public CategoryResponse updateCategory(CategoryForm update,String id) {
        Category category=getById(id);
        getByName(update.categoryName(),category.getWarehouses());
        categoryMapper.update(category,update);
        UserResponse userResponse= userController
                .getUser(category.getCreateByUser())
                .getResult();
        WarehousesResponse warehousesResponse=warehouseController
                .getWarehouse(category.getWarehouses())
                .getResult();
        CategoryResponse categoryResponse=categoryMapper.toResponse(category);
        return categoryMapper.updateWarehouse(categoryResponse,warehousesResponse,userResponse);
    }
}
