package com.example.inventoryservice.Controller;

import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Request.InventoryWarehouseRequest;
import com.example.inventoryservice.Dtos.Response.InventoryWarehouseResponse;
import com.example.inventoryservice.Form.InventoryWarehouseForm;
import com.example.inventoryservice.Service.InventoryWarehouseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/warehouses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Inventory Warehouse API", description = "Quản lý tồn kho theo vị trí bin")
public class InventoryWarehouseController {

    InventoryWarehouseService inventoryWarehouseService;

    /**
     * Lấy danh sách inventory warehouse theo warehouse với phân trang
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng items trên mỗi trang
     * @param warehouseId ID của warehouse
     * @return Page<InventoryWarehouseResponse> - Danh sách inventory theo từng bin
     */
    @GetMapping("/search/warehouse/{warehouseId}")
    public ApiResponse<Page<InventoryWarehouseResponse>> getAllByWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String warehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<InventoryWarehouseResponse>>builder()
                .Result(inventoryWarehouseService.getAllByWarehouse(pageable, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy danh sách inventory trong một bin cụ thể
     * @param binId ID của bin
     * @return List<InventoryWarehouseResponse> - Danh sách tất cả sản phẩm trong bin
     */
    @GetMapping("/search/bin/{binId}")
    public ApiResponse<List<InventoryWarehouseResponse>> getAllByBin(@PathVariable String binId) {
        return ApiResponse.<List<InventoryWarehouseResponse>>builder()
                .Result(inventoryWarehouseService.getAllByBin(binId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/bin/{binId}/singer")
    public ApiResponse<InventoryWarehouseResponse> getByBin(@PathVariable String binId) {
        return ApiResponse.<InventoryWarehouseResponse>builder()
                .Result(inventoryWarehouseService.getByBin(binId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy thông tin inventory warehouse theo ID
     * @param id ID của inventory warehouse
     * @return InventoryWarehouseResponse - Thông tin chi tiết inventory tại vị trí cụ thể
     */
    @GetMapping("/{id}")
    public ApiResponse<InventoryWarehouseResponse> getById(@PathVariable String id) {
        return ApiResponse.<InventoryWarehouseResponse>builder()
                .Result(inventoryWarehouseService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy danh sách sản phẩm sắp hết hạn
     * @param date Ngày kiểm tra hết hạn (format: yyyy-MM-dd)
     * @return List<InventoryWarehouseResponse> - Danh sách sản phẩm sắp hết hạn
     */
    @GetMapping("/expiring")
    public ApiResponse<List<InventoryWarehouseResponse>> getExpiringProducts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<InventoryWarehouseResponse>>builder()
                .Result(inventoryWarehouseService.getExpiringProducts(date))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Kiểm tra bin có trống không
     * @param binId ID của bin cần kiểm tra
     * @return Boolean - true nếu bin trống, false nếu có hàng
     */
    @GetMapping("/bin/{binId}/empty")
    public ApiResponse<Boolean> isBinEmpty(@PathVariable String binId) {
        return ApiResponse.<Boolean>builder()
                .Result(inventoryWarehouseService.isBinEmpty(binId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Tạo mới inventory warehouse (đặt hàng vào bin cụ thể)
     * @param productId Thông tin id của product cần truy xuất
     * @return <List<InventoryWarehouseResponse>> - Thông tin inventory warehouse vừa được tạo
     */
    @GetMapping("/search/product/{productId}")
    public ApiResponse<List<InventoryWarehouseResponse>> getByProductId(
            @PathVariable String productId
    ) {
        return ApiResponse.<List<InventoryWarehouseResponse>>builder()
                .Result(inventoryWarehouseService.getAllByProduct(productId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    /**
     * Lấy danh sách inventory warehouse theo product và warehouse
     * @param productId ID của sản phẩm
     * @param warehouseId ID của warehouse
     * @return List<InventoryWarehouseResponse> - Danh sách inventory theo từng bin
     */
    @GetMapping("/search/product/{productId}/warehouse/{warehouseId}")
    public ApiResponse<List<InventoryWarehouseResponse>> getByProductAndWarehouse(
            @PathVariable String productId,
            @PathVariable String warehouseId
    ) {
        return ApiResponse.<List<InventoryWarehouseResponse>>builder()
                .Result(inventoryWarehouseService.getAllByProductAndWarehouse(productId, warehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Tạo mới inventory warehouse (đặt hàng vào bin cụ thể)
     * @param request Thông tin inventory warehouse cần tạo
     * @return InventoryWarehouseResponse - Thông tin inventory warehouse vừa được tạo
     */
    @PostMapping
    public ApiResponse<InventoryWarehouseResponse> createInventoryWarehouse(
            @RequestBody InventoryWarehouseRequest request
    ) {
        return ApiResponse.<InventoryWarehouseResponse>builder()
                .Result(inventoryWarehouseService.createInventoryWarehouse(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    /**
     * Cập nhật thông tin inventory warehouse
     * @param id ID của inventory warehouse cần cập nhật
     * @param form Thông tin cập nhật
     * @return InventoryWarehouseResponse - Thông tin inventory warehouse sau khi cập nhật
     */
    @PutMapping("/{id}")
    public ApiResponse<InventoryWarehouseResponse> updateInventoryWarehouse(
            @PathVariable String id,
            @RequestBody InventoryWarehouseForm form
    ) {
        return ApiResponse.<InventoryWarehouseResponse>builder()
                .Result(inventoryWarehouseService.updateInventoryWarehouse(form, id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Xóa mềm inventory warehouse
     * @param id ID của inventory warehouse cần xóa
     * @return String - Thông báo kết quả xóa
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteInventoryWarehouse(@PathVariable String id) {
        inventoryWarehouseService.deleteInventoryWarehouse(id);
        return ApiResponse.<String>builder()
                .Result("Deleted Successfully")
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
}