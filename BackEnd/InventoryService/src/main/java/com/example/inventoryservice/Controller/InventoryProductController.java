package com.example.inventoryservice.Controller;


import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Request.InventoryProductRequest;
import com.example.inventoryservice.Dtos.Response.InventoryProductResponse;
import com.example.inventoryservice.Form.InventoryProductForm;
import com.example.inventoryservice.Service.InventoryProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Inventory Product API", description = "Quản lý tồn kho sản phẩm")
public class InventoryProductController {

    InventoryProductService inventoryProductService;

    /**
     * Lấy danh sách tất cả inventory products theo warehouse với phân trang
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng items trên mỗi trang
     * @param warehouseId ID của warehouse cần lấy inventory
     * @return Page<InventoryProductResponse> - Danh sách inventory products với thông tin phân trang
     */
    @GetMapping("/search/warehouse/{warehouseId}")
    public ApiResponse<Page<InventoryProductResponse>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<InventoryProductResponse>>builder()
                .Result(inventoryProductService.getAllByWarehouse(pageable, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy thông tin inventory product theo ID
     * @param id ID của inventory product
     * @return InventoryProductResponse - Thông tin chi tiết inventory product
     */
    @GetMapping("/{id}")
    public ApiResponse<InventoryProductResponse> getById(@PathVariable String id) {
        return ApiResponse.<InventoryProductResponse>builder()
                .Result(inventoryProductService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy thông tin inventory product theo product ID và warehouse ID
     * @param productId ID của sản phẩm
     * @param warehouseId ID của warehouse
     * @return InventoryProductResponse - Thông tin inventory của sản phẩm trong warehouse cụ thể
     */
    @GetMapping("/search/product/{productId}/warehouse/{warehouseId}")
    public ApiResponse<InventoryProductResponse> getByProductAndWarehouse(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<InventoryProductResponse>builder()
                .Result(inventoryProductService.getByProductAndWarehouseResponse(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy danh sách các sản phẩm có tồn kho thấp hơn mức tối thiểu
     * @return List<InventoryProductResponse> - Danh sách sản phẩm cần bổ sung tồn kho
     */
    @GetMapping("/low-stock")
    public ApiResponse<List<InventoryProductResponse>> getLowStockProducts() {
        return ApiResponse.<List<InventoryProductResponse>>builder()
                .Result(inventoryProductService.getLowStockProducts())
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Tạo mới inventory product
     * @param request Thông tin inventory product cần tạo
     * @return InventoryProductResponse - Thông tin inventory product vừa được tạo
     */
    @PostMapping
    public ApiResponse<InventoryProductResponse> createInventoryProduct(
            @RequestBody InventoryProductRequest request
    ) {
        return ApiResponse.<InventoryProductResponse>builder()
                .Result(inventoryProductService.createInventoryProduct(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Cập nhật thông tin inventory product
     * @param id ID của inventory product cần cập nhật
     * @param form Thông tin cập nhật
     * @return InventoryProductResponse - Thông tin inventory product sau khi cập nhật
     */
    @PutMapping("/{id}")
    public ApiResponse<InventoryProductResponse> updateInventoryProduct(
            @PathVariable String id,
            @RequestBody InventoryProductForm form
    ) {
        return ApiResponse.<InventoryProductResponse>builder()
                .Result(inventoryProductService.updateInventoryProduct(form, id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Xóa mềm inventory product
     * @param id ID của inventory product cần xóa
     * @return String - Thông báo kết quả xóa
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteInventoryProduct(@PathVariable String id) {
        inventoryProductService.deleteInventoryProduct(id);
        return ApiResponse.<String>builder()
                .Result("Deleted Successfully")
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}
