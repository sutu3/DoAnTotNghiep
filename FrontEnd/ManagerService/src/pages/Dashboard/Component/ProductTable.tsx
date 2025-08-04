import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Chip,
    Spinner,
    Avatar,
    Pagination,
    Select,
    SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { ProductSelector } from "@/Store/Selector.tsx";
import { MiddleGetAllProductBySearch } from "@/Store/Thunk/ProductThunk.tsx";
import { Product } from "@/Store/ProductSlice.tsx";

interface ProductTableProps {
    warehouseId?: string;
    showActions?: boolean;
    maxHeight?: string;
}

const ProductTable: React.FC<ProductTableProps> = ({
                                                       warehouseId = "",
                                                       showActions = true,
                                                       maxHeight = "600px"
                                                   }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("productName");

    const products = useSelector(ProductSelector) ;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchProducts();
    }, [warehouseId]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllProductBySearch(null, warehouseId,null,null,null,{pageNumber:0,pageSize:10}));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product: Product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier?.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'productName':
                return a.productName.localeCompare(b.productName);
            case 'price':
                return (a.price || 0) - (b.price || 0);
            case 'quantity':
                return (b.quantity || 0) - (a.quantity || 0);
            default:
                return 0;
        }
    });

    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStockStatus = (quantity: number, pendingExport: number = 0) => {
        const available = quantity - pendingExport;
        if (available <= 0) return { status: 'Hết hàng', color: 'danger' };
        if (available < 10) return { status: 'Sắp hết', color: 'warning' };
        return { status: 'Còn hàng', color: 'success' };
    };

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-lg p-2">
                            <Icon icon="mdi:package-variant" className="text-xl text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Danh Sách Sản Phẩm
                            </h2>
                            <p className="text-sm text-gray-600">
                                {sortedProducts.length} sản phẩm có sẵn
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Select
                            size="sm"
                            selectedKeys={[sortBy]}
                            onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                            className="w-40"
                            placeholder="Sắp xếp theo"
                        >
                            <SelectItem key="productName">Tên sản phẩm</SelectItem>
                            <SelectItem key="price">Giá tiền</SelectItem>
                            <SelectItem key="quantity">Số lượng</SelectItem>
                        </Select>
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<Icon icon="mdi:refresh" />}
                            onPress={fetchProducts}
                            isLoading={loading}
                        >
                            Làm mới
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0">
                {/* Search */}
                <div className="p-6 pb-0">
                    <Input
                        placeholder="Tìm kiếm sản phẩm theo tên, SKU hoặc nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startContent={<Icon icon="mdi:magnify" className="text-gray-400" />}
                        size="lg"
                        classNames={{
                            input: "text-sm",
                            inputWrapper: "shadow-sm border-gray-200"
                        }}
                    />
                </div>

                {/* Products Table */}
                <div className="p-6" style={{ maxHeight, overflowY: 'auto' }}>
                    <Table
                        aria-label="Products table"
                        classNames={{
                            wrapper: "shadow-none border border-gray-200 rounded-lg",
                            th: "bg-gray-50 text-gray-700 font-semibold",
                            td: "py-4 border-b border-gray-100",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>SẢN PHẨM</TableColumn>
                            <TableColumn>NHÀ CUNG CẤP</TableColumn>
                            <TableColumn>DANH MỤC</TableColumn>
                            <TableColumn>GIÁ TIỀN</TableColumn>
                            <TableColumn>TỒN KHO</TableColumn>
                            <TableColumn>TRẠNG THÁI</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải sản phẩm..." />}
                            emptyContent="Không có sản phẩm nào"
                        >
                            {paginatedProducts.map((product) => {
                                const stockStatus = getStockStatus(
                                    product.quantity || 0,
                                    product.pendingApprovedExportQuantity || 0
                                );

                                return (
                                    <TableRow key={product.productId}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={product.urlImageProduct}
                                                    size="md"
                                                    className="flex-shrink-0"
                                                    fallback={<Icon icon="mdi:package" className="text-gray-400" />}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {product.productName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU: {product.sku}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ID: {product.productId.slice(-8)}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    name={product.supplier?.supplierName?.charAt(0)}
                                                    size="sm"
                                                    className="bg-blue-100 text-blue-600"
                                                />
                                                <span className="text-gray-700">
                                                    {product.supplier?.supplierName || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                variant="flat"
                                                color="primary"
                                                size="sm"
                                            >
                                                {product.category?.categoryName || "N/A"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-green-600">
                                                {formatPrice(product.price || 0)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-blue-600">
                                                    {product.quantity || 0}
                                                </div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {product.unit?.unitName || "đơn vị"}
                                                </div>

                                                {/* Pending quantities */}
                                                <div className="flex justify-center gap-1">
                                                    <Chip
                                                        size="sm"
                                                        color="success"
                                                        variant="flat"
                                                        className="text-xs"
                                                    >
                                                        +{product.pendingApprovedImportQuantity || 0}
                                                    </Chip>
                                                    <Chip
                                                        size="sm"
                                                        color="warning"
                                                        variant="flat"
                                                        className="text-xs"
                                                    >
                                                        -{product.pendingApprovedExportQuantity || 0}
                                                    </Chip>
                                                </div>

                                                <div className="text-xs font-medium mt-1">
                                                    Khả dụng: {(product.quantity || 0) - (product.pendingApprovedExportQuantity || 0)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={stockStatus.color as any}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {stockStatus.status}
                                            </Chip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-6 pt-0 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Hiển thị</span>
                        <Select
                            size="sm"
                            selectedKeys={[itemsPerPage.toString()]}
                            onSelectionChange={(keys) => setItemsPerPage(Number(Array.from(keys)[0]))}
                            className="w-20"
                        >
                            <SelectItem key="5">5</SelectItem>
                            <SelectItem key="10">10</SelectItem>
                            <SelectItem key="20">20</SelectItem>
                            <SelectItem key="50">50</SelectItem>
                        </Select>
                        <span className="text-sm text-gray-500">
                            của {sortedProducts.length} sản phẩm
                        </span>
                    </div>

                    <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        size="sm"
                        showControls
                        classNames={{
                            wrapper: "gap-0 overflow-visible",
                            item: "w-8 h-8 text-small rounded-none bg-transparent",
                            cursor: "bg-gradient-to-b shadow-lg from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-bold",
                        }}
                    />
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductTable;