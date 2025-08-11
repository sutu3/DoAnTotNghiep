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
    Spinner,
    Pagination,
    Avatar,
    Chip,
    Badge,
    Tooltip
} from "@heroui/react";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {ProductSelector, TotalPageProduct} from "@/Store/Selector.tsx";
import { MiddleGetAllProductBySearch } from "@/Store/Thunk/ProductThunk.tsx";
import ExportItemModal from "@/pages/OrderExport/Component/Modal/ExportItemModal.tsx";
import {Product, setProductList} from "@/Store/ProductSlice.tsx";
import {Filters} from "@/pages/OrderExport/page.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {Package, Plus, Info, Building2, Tag, DollarSign} from "lucide-react";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface ProductExportTableProps {
    formData:OrderRequestExportCreate;
    filters?:Filters;
}

const ProductExportTable: React.FC<ProductExportTableProps> = ({formData,
                                                                   filters
                                                               }) => {
    const dispatch = useDispatch();
    const products = useSelector(ProductSelector);
    const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialProduct = useSelector(TotalPageProduct);
    const [page, setPage] = useState(1);
    useEffect(() => {
        if (formData.warehouse) {
            dispatch(setProductList([]));
            setLoading(true);
            const supplierId= filters?.supplierFilter === "all" ? null : filters?.supplierFilter;
            const categoryId = filters?.categoryFilter === "all" ? null : filters?.categoryFilter;
            const unitId= filters?.unitFilter === "all" ? null : filters?.unitFilter;
            const productName=filters?.searchTerm=== "" ? null : filters?.searchTerm;
            const pageApi:pageApi={ pageNumber: page - 1, pageSize: 5 };
            (dispatch as any)(MiddleGetAllProductBySearch(supplierId, formData.warehouse,categoryId, unitId,productName,pageApi))
                .finally(() => setLoading(false));
        }
    }, [formData.warehouse, filters, page]);

    const pages = initialProduct;

    const handleAddToCart = (product: any) => {
            setSelectedProduct(product);
            setIsModalOpen(true);

    };

    const filteredProducts: Product[] = useMemo(() => {
        if(!products) return [];
        return products;
    }, [products, filters]);

    // Enhanced columns with better organization
    const columns = [
        {
            key: "product",
            label: "Thông tin sản phẩm",
            width: "25%"
        },
        {
            key: "category",
            label: "Phân loại",
            width: "15%"
        },
        {
            key: "supplier",
            label: "Nhà cung cấp",
            width: "20%"
        },
        {
            key: "pricing",
            label: "Giá & Đơn vị",
            width: "20%"
        },
        {
            key: "actions",
            label: "Thao tác",
            width: "10%"
        }
    ];

    const bottomContent = (
        <div className="py-3 px-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {filteredProducts.length > 0 ? ((page - 1) * 5 + 1) : 0} - {Math.min(page * 5, filteredProducts.length * pages)}
                của {filteredProducts.length * pages} sản phẩm
            </div>
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
                className="gap-2"
                radius="sm"
            />
        </div>
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Get stock status color
    const getStockStatusColor = (stock: number) => {
        if (stock <= 0) return "danger";
        if (stock <= 10) return "warning";
        return "success";
    };

    const getStockStatusText = (stock: number) => {
        if (stock <= 0) return "Hết hàng";
        if (stock <= 10) return "Sắp hết";
        return "Còn hàng";
    };

    return (
        <>
            <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Danh Sách Sản Phẩm
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Chọn sản phẩm để thêm vào đơn xuất kho
                                </p>
                            </div>
                        </div>
                        <Chip
                            variant="flat"
                            color="primary"
                            startContent={<Info className="w-4 h-4" />}
                        >
                            {filteredProducts.length } sản phẩm
                        </Chip>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    <Table
                        bottomContent={bottomContent}
                        aria-label="Products table"
                        isStriped
                        removeWrapper
                        classNames={{
                            table: "min-h-[500px]",
                            thead: "bg-gray-50 dark:bg-gray-900",
                            th: "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold",
                            td: "py-4",
                            tbody: "divide-y divide-gray-200 dark:divide-gray-700"
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    key={column.key}
                                    width={column.width}
                                    className="text-left"
                                >
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={filteredProducts}
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải sản phẩm..." size="lg" />}
                            emptyContent={
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                                    <p className="text-gray-500 text-lg font-medium">Không có sản phẩm nào</p>
                                    <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc để tìm sản phẩm khác</p>
                                </div>
                            }
                        >
                            {(product: any) => (
                                <TableRow
                                    key={product.productId}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    {/* Product Info Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar
                                                    src={product.urlImageProduct}
                                                    size="lg"
                                                    className="flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700"
                                                    fallback={<Package className="w-6 h-6" />}
                                                />
                                                <Badge
                                                    content=""
                                                    color={getStockStatusColor(product.stock || 0)}
                                                    size="sm"
                                                    placement="bottom-right"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {product.productName}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Chip
                                                        variant="flat"
                                                        color="default"
                                                        size="sm"
                                                        startContent={<Tag className="w-3 h-3" />}
                                                    >
                                                        {product.sku || "N/A"}
                                                    </Chip>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Tồn kho: <span className={`font-semibold ${
                                                    product.stock <= 0 ? 'text-red-600' :
                                                        product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                        {product.stock || 0} {product.unit?.unitName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Category Column */}
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Chip
                                                variant="flat"
                                                color="secondary"
                                                size="sm"
                                                className="w-full justify-center"
                                            >
                                                {product.category?.categoryName || "Chưa phân loại"}
                                            </Chip>
                                            <div className="flex items-center justify-center">
                                                <Chip
                                                    variant="dot"
                                                    color={getStockStatusColor(product.quantity || 0)}
                                                    size="sm"
                                                >
                                                    {getStockStatusText(product.quantity || 0)}
                                                </Chip>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Supplier Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {product.supplier?.supplierName || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Pricing Column */}
                                    <TableCell>
                                        <div className="text-center space-y-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            <Chip
                                                variant="flat"
                                                color="primary"
                                                size="sm"
                                                className="text-xs"
                                            >
                                                per {product.unit?.unitName || "đơn vị"}
                                            </Chip>
                                        </div>
                                    </TableCell>

                                    {/* Actions Column */}
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <Tooltip content="Thêm vào đơn xuất kho">
                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    isIconOnly
                                                    onClick={() => handleAddToCart(product)}
                                                    isDisabled={product.stock <= 0}
                                                    className="w-full"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <ExportItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                warehouseId={formData.warehouse}
            />
        </>
    );
}

export default ProductExportTable;