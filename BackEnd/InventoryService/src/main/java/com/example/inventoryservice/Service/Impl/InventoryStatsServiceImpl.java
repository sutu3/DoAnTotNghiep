package com.example.inventoryservice.Service.Impl;

import com.example.inventoryservice.Client.OrderService.OrderController;
import com.example.inventoryservice.Client.ProductService.Dto.Response.ProductResponse;
import com.example.inventoryservice.Client.ProductService.Redis.ProductController;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Bin.BinResponse;
import com.example.inventoryservice.Client.WarehouseService.Dto.Responses.Stack.StackResponse;
import com.example.inventoryservice.Client.WarehouseService.Redis.WarehouseController;
import com.example.inventoryservice.Client.WarehouseService.WarehouseClient;
import com.example.inventoryservice.Dtos.Response.InventoryStatsResponse;
import com.example.inventoryservice.Dtos.Response.SuggestedLocationStats;
import com.example.inventoryservice.Dtos.Response.WarehouseCapacityStats;
import com.example.inventoryservice.Exception.AppException;
import com.example.inventoryservice.Exception.ErrorCode;
import com.example.inventoryservice.Module.InventoryProduct;
import com.example.inventoryservice.Module.InventoryWarehouse;
import com.example.inventoryservice.Module.StockMovement;
import com.example.inventoryservice.Repo.InventoryProductRepo;
import com.example.inventoryservice.Repo.InventoryWarehouseRepo;
import com.example.inventoryservice.Repo.StockMovementRepo;
import com.example.inventoryservice.Service.InventoryStatsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryStatsServiceImpl implements InventoryStatsService {

    InventoryProductRepo inventoryProductRepo;
    InventoryWarehouseRepo inventoryWarehouseRepo;
    StockMovementRepo stockMovementRepo;
    ProductController productController;
    WarehouseController warehouseController;
    WarehouseClient warehouseClient;
    OrderController orderController;

    @Override
    public InventoryStatsResponse getProductInventoryStats(String productId, String warehouseId) {
        // Lấy thông tin inventory product
        Optional<InventoryProduct> inventoryProductOpt = inventoryProductRepo
                .findByProductAndWarehouseAndIsDeleted(productId, warehouseId, false);

        if (inventoryProductOpt.isEmpty()) {
            throw new AppException(ErrorCode.INVENTORY_PRODUCT_NOT_FOUND);
        }

        InventoryProduct inventoryProduct = inventoryProductOpt.get();

        // Lấy thông tin sản phẩm từ ProductService
        ProductResponse productDetails = productController.getProductById(productId).getResult();

        // Tính toán pending orders từ OrderService
        Integer pendingOrders = calculatePendingOrders(productId, warehouseId);

        // Tính giá trung bình từ stock movements
        BigDecimal averagePrice = calculateAveragePrice(productId, warehouseId);

        // Lấy danh sách nhà cung cấp gần đây
        List<String> recentSuppliers = getRecentSuppliers(productId, warehouseId);

        // Thống kê warehouse capacity
        WarehouseCapacityStats warehouseCapacity = getWarehouseCapacityStats(warehouseId);

        // Đề xuất vị trí
        List<SuggestedLocationStats> suggestedLocations = getSuggestedLocations(productId, warehouseId);

        return InventoryStatsResponse.builder()
                .productId(productId)
                .productName(productDetails.getProductName())
                .currentStock(inventoryProduct.getTotalQuantity())
                .pendingOrders(pendingOrders)
                .minimumStock(inventoryProduct.getMinStockLevel())
                .averagePrice(averagePrice)
                .lastImportDate(inventoryProduct.getLastImportDate())
                .recentSuppliers(recentSuppliers)
                .warehouseCapacity(warehouseCapacity)
                .suggestedLocations(suggestedLocations)
                .build();
    }

    @Override
    public WarehouseCapacityStats getWarehouseCapacityStats(String warehouseId) {
        // Lấy tất cả bins trong warehouse từ WarehouseService
        List<BinResponse> allBins = warehouseController.getAllListBinByWarehouseId(warehouseId).getResult();

        // Đếm bins đã sử dụng
        Integer occupiedBins = inventoryWarehouseRepo
                .findAllByWarehouseAndIsDeleted(warehouseId, false, Pageable.unpaged())
                .getContent()
                .stream()
                .collect(Collectors.groupingBy(InventoryWarehouse::getBin))
                .size();

        Integer totalBins = allBins.size();
        Integer availableBins = totalBins - occupiedBins;

        return WarehouseCapacityStats.builder()
                .totalBins(totalBins)
                .occupiedBins(occupiedBins)
                .availableBins(availableBins)
                .build();
    }

    @Override
    public List<SuggestedLocationStats> getSuggestedLocations(String productId, String warehouseId) {
        List<SuggestedLocationStats> suggestions = new ArrayList<>();

        // Lấy danh sách bins trống
        List<BinResponse> emptyBins = getEmptyBins(warehouseId);

        // Logic đề xuất vị trí dựa trên:
        // 1. Bins gần lối vào (có thể dựa trên naming convention)
        // 2. Bins có capacity phù hợp
        // 3. Bins trong cùng stack với sản phẩm tương tự

        for (BinResponse bin : emptyBins.stream().limit(3).collect(Collectors.toList())) {
            String reason = generateLocationReason(bin, productId, warehouseId);

            suggestions.add(SuggestedLocationStats.builder()
                    .stackName(getStackNameFromBin(bin))
                    .binCode(bin.getBinCode())
                    .reason(reason)
                    .build());
        }

        return suggestions;
    }

    private Integer calculatePendingOrders(String productId, String warehouseId) {
        try {
            // Gọi OrderService để lấy pending orders
            return orderController.getPendingOrdersByProduct(productId, warehouseId).getResult();
        } catch (Exception e) {
            log.warn("Cannot fetch pending orders for product {} in warehouse {}", productId, warehouseId);
            return 0;
        }
    }

    private BigDecimal calculateAveragePrice(String productId, String warehouseId) {
        // Tính giá trung bình từ stock movements gần đây (30 ngày)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        List<StockMovement> recentMovements = stockMovementRepo
                .findByDateRange(thirtyDaysAgo, LocalDateTime.now())
                .stream()
                .filter(sm -> sm.getProduct().equals(productId))
                .filter(sm -> sm.getUnitCost() != null)
                .collect(Collectors.toList());

        if (recentMovements.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalCost = recentMovements.stream()
                .map(StockMovement::getUnitCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalCost.divide(BigDecimal.valueOf(recentMovements.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    private List<String> getRecentSuppliers(String productId, String warehouseId) {
        try {
            // Gọi OrderService để lấy recent suppliers
            return orderController.getRecentSuppliersByProduct(productId, warehouseId).getResult();
        } catch (Exception e) {
            log.warn("Cannot fetch recent suppliers for product {} in warehouse {}", productId, warehouseId);
            return new ArrayList<>();
        }
    }

    private List<BinResponse> getEmptyBins(String warehouseId) {
        // Lấy tất cả bins trong warehouse
        List<BinResponse> allBins = warehouseController.getAllListBinByWarehouseId(warehouseId).getResult();

        // Filter bins trống
        return allBins.stream()
                .filter(bin -> inventoryWarehouseRepo.isBinEmpty(bin.getBinId()))
                .collect(Collectors.toList());
    }

    private String generateLocationReason(BinResponse bin, String productId, String warehouseId) {
        // Logic đề xuất lý do dựa trên:
        // - Vị trí bin (gần lối vào, dễ tiếp cận)
        // - Capacity phù hợp
        // - Proximity với sản phẩm tương tự

        if (bin.getBinCode().contains("A1") || bin.getBinCode().contains("001")) {
            return "Vị trí gần lối vào, dễ xuất hàng";
        } else if (bin.getCapacity() >= 100) {
            return "Khoảng trống phù hợp và an toàn";
        } else {
            return "Vị trí tối ưu cho loại sản phẩm này";
        }
    }

    private String getStackNameFromBin(BinResponse bin) {
        // Extract stack name từ bin code hoặc gọi WarehouseService
        try {
            StackResponse stack = warehouseClient.getStackByBin(bin.getBinId()).getResult();
            return stack.getStackName();
        } catch (Exception e) {
            // Fallback: extract từ bin code
            String binCode = bin.getBinCode();
            if (binCode.contains("-")) {
                return binCode.split("-")[0];
            }
            return "Unknown Stack";
        }
    }
}
