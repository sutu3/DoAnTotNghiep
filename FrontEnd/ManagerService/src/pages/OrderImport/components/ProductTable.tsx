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
    Avatar, Pagination
} from "@heroui/react";
import { Package, Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {ProductSelector, TotalPageProduct} from "@/Store/Selector.tsx";
import { MiddleGetAllProductBySearch } from "@/Store/Thunk/ProductThunk.tsx";
import AddProductModal from "./AddProductModal";
import {Filters} from "@/pages/OrderExport/page.tsx";
import { setProductList } from "@/Store/ProductSlice";
import {pageApi} from "@/Api/UrlApi.tsx";

interface ProductTableProps {
    warehouseId: string;
    filters?:Filters;
}

const ProductTable: React.FC<ProductTableProps> = ({ warehouseId,filters }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const products = useSelector(ProductSelector) || [];
    const dispatch = useDispatch();
    const initialProduct = useSelector(TotalPageProduct);
    const [page, setPage] = useState(1);
    useEffect(() => {
        if (warehouseId) {
            dispatch(setProductList([]));
            setLoading(true);
            const supplierId= filters?.supplierFilter === "all" ? null : filters?.supplierFilter;
            const categoryId = filters?.categoryFilter === "all" ? null : filters?.categoryFilter;
            const unitId= filters?.unitFilter === "all" ? null : filters?.unitFilter;
            const productName=filters?.searchTerm=== "" ? null : filters?.searchTerm;
            const pageApi:pageApi={ pageNumber: page - 1, pageSize: 5 };
            const fetch= async () => {
                (dispatch as any)(MiddleGetAllProductBySearch(supplierId, warehouseId, categoryId, unitId, productName, pageApi))
                    .finally(() => setLoading(false));
            }
            fetch();
        }
    }, [warehouseId, filters]);
    const pages = initialProduct;

    const filteredProducts = products.filter((product: any) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    );
    return (
        <>
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Danh Sách Sản Phẩm
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {filteredProducts.length} sản phẩm có sẵn
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {/* Search */}
                    <div className="mb-6">
                        <Input
                            placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<Search className="w-4 h-4 text-gray-400" />}
                            size="lg"
                            classNames={{
                                input: "text-sm",
                                inputWrapper: "shadow-sm border-gray-200"
                            }}
                        />
                    </div>

                    {/* Products Table */}
                    <Table
                        bottomContent={bottomContent}
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
                            <TableColumn>THAO TÁC</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải sản phẩm..." />}
                            emptyContent="Không có sản phẩm nào"
                        >
                            {filteredProducts.map((product: any) => (
                                <TableRow key={product.productId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={product.urlImageProduct}
                                                size="md"
                                                className="flex-shrink-0"
                                                fallback={<Package className="w-5 h-5" />}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {product.productName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    SKU: {product.sku}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-700">
                                            {product.supplier?.supplierName || "N/A"}
                                        </span>
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
                                            {formatPrice(product.price)}
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

                                            {/* Compact view với tooltip */}
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
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            size="sm"
                                            startContent={<Plus className="w-4 h-4" />}
                                            onClick={() => handleAddProduct(product)}
                                        >
                                            Thêm
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </>
    );
};

export default ProductTable;