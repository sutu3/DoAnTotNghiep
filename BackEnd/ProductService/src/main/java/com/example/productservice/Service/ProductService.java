package com.example.productservice.Service;

import com.example.productservice.Client.UserService.Dto.Response.UserResponse;
import com.example.productservice.Client.WarehouseService.Dto.Responses.Warehouse.WarehousesResponse;
import com.example.productservice.Dto.Requests.ProductRequest;
import com.example.productservice.Dto.Responses.Product.ProductResponse;
import com.example.productservice.Form.ProductForm;
import com.example.productservice.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    /**
     * Lấy danh sách sản phẩm theo kho, có phân trang.
     *
     * @param warehouse ID của kho cần lấy sản phẩm.
     * @param pageable  Thông tin phân trang.
     * @return Danh sách trang của {@link ProductResponse}.
     */
    Page<ProductResponse> getAllByWarehouses(String warehouse, Pageable pageable);

    /**
     * Lấy danh sách sản phẩm theo nhà cung cấp và kho, có phân trang.
     *
     * @param supplier  ID nhà cung cấp.
     * @param warehouse ID của kho.
     * @param pageable  Thông tin phân trang.
     * @return Danh sách trang của {@link ProductResponse}.
     */
    Page<ProductResponse> getAllBySupplierAndWarehouse(String supplier, String warehouse, Pageable pageable);
    List<ProductResponse> searchProducts(String productName,String warehouses, String sku, String supplier, Boolean isActive);
    /**
     * Lấy thực thể sản phẩm từ ID.
     *
     * @param id ID của sản phẩm.
     * @return {@link Product} tương ứng.
     */
    Product getById(String id);

    /**
     * Trả về thông tin chi tiết của một sản phẩm dưới dạng {@link ProductResponse} dựa trên ID đã cung cấp.
     *
     * @param id ID của sản phẩm cần tìm.
     * @return {@link ProductResponse} chứa thông tin chi tiết của sản phẩm.
     * @throws com.example.productservice.Exception.AppException nếu sản phẩm không tồn tại.
     */
    ProductResponse getByIdResponse(String id);

    /**
     * Tạo mới một sản phẩm từ dữ liệu yêu cầu.
     *
     * @param request Thông tin sản phẩm cần tạo.
     * @return {@link ProductResponse} của sản phẩm vừa tạo.
     */
    ProductResponse createProduct(ProductRequest request);

    /**
     * Tìm kiếm sản phẩm dựa trên mã SKU.
     *
     * @param sku Mã SKU của sản phẩm.
     * @return {@link ProductResponse} của sản phẩm nếu tìm thấy.
     */
    ProductResponse getBySku(String sku);

    /**
     * Cập nhật thông tin sản phẩm theo ID.
     *
     * @param update     Dữ liệu cập nhật.
     * @param productId  ID sản phẩm cần cập nhật.
     * @return {@link ProductResponse} sau khi cập nhật.
     */
    ProductResponse updateProduct(ProductForm update, String productId);

    /**
     * Xóa sản phẩm theo ID (logic delete nếu có).
     *
     * @param productId ID của sản phẩm cần xóa.
     */
    void deleteByProductId(String productId);
    ProductResponse enrich(Product product);
}
