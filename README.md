# DoAnTotNghiep - Backend

## Tổng quan dự án

Đây là hệ thống backend phục vụ cho bài toán quản lý kho, sản phẩm, đơn hàng, người dùng và dịch vụ file. Dự án được tổ chức theo mô hình microservices với các module chính:

- **Order**: Quản lý đơn nhập hàng, tích hợp với các dịch vụ kho, sản phẩm, người dùng.
- **FileService**: Quản lý upload, lưu trữ và truy xuất file (hình ảnh) sử dụng Cloudinary.
- **Warehouse**: Quản lý kho, bin, stack, các thực thể vật lý trong kho.
- **ProductService**: Quản lý sản phẩm, danh mục, đơn vị tính, nhóm đơn vị.
- **UserService**: Quản lý người dùng, nhà cung cấp, nhiệm vụ, phân quyền, trạng thái.

---

## Chức năng chính từng module

### 1. Order

- Quản lý đơn nhập hàng, các item nhập kho.
- Tích hợp gọi dịch vụ kho, sản phẩm, người dùng qua FeignClient.
- Mapping dữ liệu nhập kho, phản hồi API chuẩn hóa.

### 2. FileService

- Upload file ảnh lên Cloudinary.
- Lưu thông tin file vào database.
- Truy xuất, lấy thông tin file theo id.
- Cấu hình CORS, Cloudinary.

### 3. Warehouse

- Quản lý kho, bin, stack.
- Tìm kiếm, phân trang, lọc kho/bin/stack.
- Mapping dữ liệu, phản hồi API chuẩn hóa.
- Xử lý ngoại lệ, validate dữ liệu.

### 4. ProductService

- Quản lý sản phẩm, danh mục, đơn vị tính, nhóm đơn vị.
- Tìm kiếm, phân trang, lọc sản phẩm.
- Mapping dữ liệu, phản hồi API chuẩn hóa.
- Tích hợp gọi dịch vụ kho, người dùng.

### 5. UserService

- Quản lý người dùng, nhà cung cấp, nhiệm vụ, loại nhiệm vụ, trạng thái.
- Phân quyền, validate trạng thái, enum.
- Mapping dữ liệu, phản hồi API chuẩn hóa.
- Tích hợp gọi dịch vụ kho, sản phẩm.

---

## Cấu trúc thư mục & file (đã rà soát)

### Order

- src/main/java/com/example/order/
  - OrderApplication.java
  - Mapper/ImportItemMapper.java
  - Module/ImportItem.java, BaseEntity.java
  - Repo/ImportItem.java
  - Dto/Request/ImportRequestItem.java
  - Dto/Response/ApiResponse.java, ImportItem/ImportResponseItem.java
  - Client/ProductService/ProductController.java, Dto/Response/ProductResponse.java
  - Client/WarehouseService/WarehouseController.java, Fallbacks/WarehouseServiceFallback.java, Dto/Responses/Warehouse/WarehousesResponse.java
  - Client/UserService/UserController.java, Fallbacks/UserServiceFallback.java, Dto/Response/UserResponse.java, SupplierResponse.java

### FileService

- src/main/java/com/ddd/fileservice/
  - Service/UploadImageFileService.java, ImageService.java
  - Controller/UploadFileController.java
  - Config/CloundinaryConfig.java, CloudinaryProperties.java, WebConfig.java
  - Repo/ImageRepo.java, UploadImageFile.java
  - Response/ImageResponse.java, ApiResponse.java
  - Mapper/ImageMapper.java
  - Entity/Image.java
  - Exception/GlobalException.java, AppException.java, ErrorCode.java

### Warehouse

- src/main/java/com/ddd/warehouse/
  - Service/BinService.java, StackService.java, WarehouseService.java
  - Module/Bins.java, Stacks.java, Warehouses.java, BaseEntity.java
  - Mapper/BinMapper.java, WarehouseMapper.java, StackMapper.java
  - Enum/BinStatus.java
  - Controller/StackController.java, BinController.java, WarehouseController.java
  - Utils/CheckNumber.java
  - Repo/WarehouseRepo.java, BinRepo.java, StackRepo.java
  - Form/AddressForm.java, BinForm.java, StackForm.java, WarehousesForm.java
  - Exception/ErrorCode.java, GlobalException.java, AppException.java
  - Dto/Request/StackRequest.java, BinRequest.java, WarehousesRequest.java
  - Dto/Response/ApiResponse.java, Bin/BinResponse.java, BinResponseNoWarehouse.java, Stack/StackResponse.java, Warehouse/WarehousesResponse.java
  - Config/WebConfig.java

### ProductService

- src/main/java/com/example/productservice/
  - Service/UnitService.java, CategoryService.java, ProductService.java, GroupUnitService.java
  - Repo/UnitRepo.java, CategoryRepo.java, GroupUnitRepo.java, ProductRepo.java
  - Mapper/UnitMapper.java, CategoryMapper.java, GroupUnitMapper.java, ProductMapper.java
  - Controller/CategoryController.java, UnitController.java, GroupUnitController.java, ProductController.java
  - Model/Unit.java, BaseEntity.java, Category.java, GroupUnit.java, Product.java
  - Form/CategoryForm.java, GroupUnitForm.java, ProductForm.java, UnitForm.java
  - Enum/UnitType.java
  - Exception/AppException.java, ErrorCode.java, GlobalException.java
  - Dto/Responses/ApiResponse.java, Category/CategoryNameResponse.java, CategoryResponse.java, CategoryResponseNoList.java, Unit/UnitNameResponse.java, UnitResponse.java, UnitResponseNoList.java, GroupUnit/GroupUnitResponse.java, GroupUnitResponseNoList.java, Product/ProductResponse.java
  - Dto/Requests/CategoryRequest.java, GroupUnitRequest.java, ProductRequest.java, UnitRequest.java
  - Config/WebConfig.java
  - Client/WarehouseService/WarehouseController.java, Fallbacks/WarehouseServiceFallback.java, Dto/Responses/Warehouse/WarehousesResponse.java
  - Client/UserService/UserController.java, Fallbacks/UserServiceFallback.java, Dto/Response/SupplierResponse.java, UserResponse.java

### UserService

- src/main/java/com/example/userservice/
  - Service/SupplierService.java, TaskService.java, UserService.java, TaskUserService.java, TaskTypeService.java
  - Controller/SupplierController.java, UserController.java, TaskController.java, TaskTypeController.java, TaskUserController.java
  - Repo/SupplierRepo.java, UserRepo.java, TaskRepo.java, TaskUserRepo.java, TaskTypeRepo.java
  - Mapper/TaskMapper.java, SupplierMapper.java, UserMapper.java, TaskUserMapper.java, TaskTypeMapper.java
  - Model/AddressEntity.java, Supplier.java, TaskType.java, Tasks.java, Users.java, TaskUser.java, BaseEntity.java
  - Exception/ErrorCode.java, GlobalException.java, AppException.java
  - Form/SupplierForm.java, TaskTypeForm.java, TaskForm.java
  - Enum/LevelEnum.java, StatusSupplier.java, StatusTaskEnum.java, StatusEnum.java, StatusTaskUserEnum.java
  - Config/WebConfig.java
  - Dto/Request/SupplierRequest.java, TaskRequest.java, TaskTypeRequest.java, UserRequest.java, LevelRequest.java, StatusRequest.java, TaskUserRequest.java
  - Dto/Responses/ApiResponse.java, Supplier/SupplierResponse.java, TaskType/TaskTypeResponseNoList.java, TaskTypeResponse.java, TaskUser/TaskUserResponseNoList.java, TaskUserResponse.java, User/UserResponse.java, Task/TaskResponse.java
  - Client/WarehouseService/WarehouseController.java, Dto/Responses/Warehouse/WarehousesResponse.java, Fallbacks/WarehouseServiceFallback.java

---

## Hướng dẫn sử dụng

- Mỗi module là một service Spring Boot độc lập, có thể build và deploy riêng.
- Cấu hình kết nối database, Cloudinary, CORS... trong từng module.
- Để phát triển hoặc mở rộng, hãy tham khảo từng file đã liệt kê ở trên.

---

## Liên hệ

- Nếu cần hỗ trợ hoặc góp ý, vui lòng liên hệ nhóm phát triển.
