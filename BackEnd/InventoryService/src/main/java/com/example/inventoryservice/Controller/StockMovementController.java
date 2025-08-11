package com.example.inventoryservice.Controller;

import com.example.inventoryservice.Config.FeignConfiguration;
import com.example.inventoryservice.Dtos.ApiResponse;
import com.example.inventoryservice.Dtos.Request.StockMovementRequest;
import com.example.inventoryservice.Dtos.Response.StockMovementResponse;
import com.example.inventoryservice.Service.StockMovementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory/movements")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Stock Movement API", description = "Quản lý lịch sử nhập xuất kho")
public class StockMovementController {

    StockMovementService stockMovementService;
    /**
     * Lấy danh sách stock movements theo sản phẩm với phân trang
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng items trên mỗi trang
     * @param productId ID của sản phẩm
     * @return Page<StockMovementResponse> - Danh sách lịch sử nhập xuất của sản phẩm
     */
    @GetMapping("/search/product/{productId}")
    public ApiResponse<Page<StockMovementResponse>> getAllByProduct(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String productId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<StockMovementResponse>>builder()
                .Result(stockMovementService.getAllByProduct(pageable, productId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }
    @GetMapping("/search/warehouse/{warehouseId}/date-range")
    public ApiResponse<List<StockMovementResponse>> getStockMovementsByWarehouseAndDateRange(
            @PathVariable String warehouseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    ) {
        return ApiResponse.<List<StockMovementResponse>>builder()
                .Result(stockMovementService.getStockMovementsByWarehouseAndDateRange(warehouseId, fromDate, toDate))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }
    @GetMapping("/search/all-warehouses/date-range")
    public ApiResponse<List<StockMovementResponse>> getAllWarehousesStockMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate
    ) {
        return ApiResponse.<List<StockMovementResponse>>builder()
                .Result(stockMovementService.getAllWarehousesStockMovementsByDateRange(fromDate, toDate))
                .code(0)
                .message("Success")
                .success(true)
                .build();
    }



    /**
     * Lấy danh sách stock movements theo inventory warehouse với phân trang
     * @param page Số trang (bắt đầu từ 0)
     * @param size Số lượng items trên mỗi trang
     * @param inventoryWarehouseId ID của inventory warehouse
     * @return Page<StockMovementResponse> - Danh sách lịch sử nhập xuất tại vị trí cụ thể
     */
    @GetMapping("/search/inventory-warehouse/{inventoryWarehouseId}")
    public ApiResponse<Page<StockMovementResponse>> getAllByInventoryWarehouse(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String inventoryWarehouseId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<StockMovementResponse>>builder()
                .Result(stockMovementService.getAllByInventoryWarehouse(pageable, inventoryWarehouseId))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy thông tin stock movement theo ID
     * @param id ID của stock movement
     * @return StockMovementResponse - Thông tin chi tiết movement
     */
    @GetMapping("/{id}")
    public ApiResponse<StockMovementResponse> getById(@PathVariable String id) {
        return ApiResponse.<StockMovementResponse>builder()
                .Result(stockMovementService.getByIdResponse(id))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Lấy danh sách stock movements trong khoảng thời gian
     * @param startDate Ngày bắt đầu (format: yyyy-MM-ddTHH:mm:ss)
     * @param endDate Ngày kết thúc (format: yyyy-MM-ddTHH:mm:ss)
     * @return List<StockMovementResponse> - Danh sách movements trong khoảng thời gian
     */
    @GetMapping("/search/date-range")
    public ApiResponse<List<StockMovementResponse>> getMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ApiResponse.<List<StockMovementResponse>>builder()
                .Result(stockMovementService.getMovementsByDateRange(startDate, endDate))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

    /**
     * Tạo mới stock movement (nhập/xuất/chuyển kho)
     * @param request Thông tin stock movement cần tạo
     * @return StockMovementResponse - Thông tin stock movement vừa được tạo
     */
    @PostMapping
    public ApiResponse<StockMovementResponse> createStockMovement(
            @RequestBody StockMovementRequest request
    ) {
        return ApiResponse.<StockMovementResponse>builder()
                .Result(stockMovementService.createStockMovement(request))
                .code(0)
                .message("SuccessFull")
                .success(true)
                .build();
    }

}
