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
    Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductSelector } from "@/Store/Selector.tsx";
import { MiddleGetAllProductBySearch } from "@/Store/Thunk/ProductThunk.tsx";
import ExportItemModal from "@/pages/OrderExport/Component/Modal/ExportItemModal.tsx";
import {Product} from "@/Store/ProductSlice.tsx";

interface ProductExportTableProps {
    warehouseId: string;
}

export default function ProductExportTable({ warehouseId }: ProductExportTableProps) {
    const dispatch = useDispatch();
    const products = useSelector(ProductSelector);
    const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (warehouseId) {
            setLoading(true);
            (dispatch as any)(MiddleGetAllProductBySearch(searchTerm, warehouseId))
                .finally(() => setLoading(false));
        }
    }, [warehouseId, searchTerm, dispatch]);

    const handleAddToCart = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter((product: any) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: "product", label: "Sản phẩm" },
        { key: "sku", label: "SKU" },
        { key: "unit", label: "Đơn vị" },
        { key: "price", label: "Đơn giá" },
        { key: "actions", label: "Thao tác" }
    ];

    return (
        <>
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:package-variant" className="text-xl text-blue-600" />
                            <h2 className="text-xl font-semibold">Danh Sách Sản Phẩm</h2>
                        </div>
                        <div className="w-80">
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                startContent={<Icon icon="mdi:magnify" />}
                                size="sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table
                        aria-label="Products table"
                        isStriped
                        removeWrapper
                        classNames={{
                            table: "min-h-[400px]",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.key}>
                                    {column.label}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            items={filteredProducts}
                            isLoading={loading}
                            loadingContent={<Spinner label="Đang tải..." />}
                            emptyContent="Không có sản phẩm nào"
                        >
                            {(product: any) => (
                                <TableRow key={product.productId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                                <Icon icon="mdi:cube-outline" className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{product.productName}</p>
                                                <p className="text-sm text-gray-500">{product.category?.categoryName}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                            {product.sku}
                                        </code>
                                    </TableCell>
                                    <TableCell>{product.unit?.unitName}</TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-green-600">
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            onPress={() => handleAddToCart(product)}
                                            startContent={<Icon icon="mdi:plus" />}
                                        >
                                            Thêm
                                        </Button>
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
                warehouseId={warehouseId}
            />
        </>
    );
}