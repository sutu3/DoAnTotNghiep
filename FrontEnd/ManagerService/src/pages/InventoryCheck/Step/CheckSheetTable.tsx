import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Chip, Badge, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import StockMovementAdjustmentModal from "@/components/Staff/InventoryCheck/Modal/StockMovementAdjustmentModal.tsx";
import {AdjustmentData, InventoryCheckItem } from '../Store/InventoryCheckSlice';
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";

interface CheckSheetTableProps {
    selectedProducts: InventoryCheckItem[];
    onRemoveProduct: (productId: string) => void;
    onProductAdjustment: (adjustmentData: AdjustmentData, productId: string,inventoryWarehouse:InventoryWarehouse|null) => void;
}

const CheckSheetTable: React.FC<CheckSheetTableProps> = ({
                                                             selectedProducts,
                                                             onRemoveProduct,
                                                             onProductAdjustment
                                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<InventoryCheckItem | null>(null);

    const columns = [
        { key: "productInfo", label: "Thông Tin Sản Phẩm" },
        { key: "location", label: "Vị Trí & Trạng Thái" },
        { key: "quantities", label: "Số Lượng" },
        { key: "difference", label: "Chênh Lệch" },
        { key: "reason", label: "Lý Do" },
        { key: "actions", label: "Thao Tác" }
    ];

    const handleEditProduct = (product: InventoryCheckItem) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (adjustmentData: AdjustmentData) => {
        if (selectedProduct) {
            onProductAdjustment(adjustmentData, selectedProduct.inventoryWarehouseId,null);
            setIsModalOpen(false);
            setSelectedProduct(null);
        }
    };

    const renderCell = (item: InventoryCheckItem, columnKey: string) => {
        switch (columnKey) {
            case "productInfo":
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Icon icon="mdi:package-variant" className="text-white text-lg" />
                            </div>
                            <Badge
                                content=""
                                color="success"
                                shape="circle"
                                placement="bottom-right"
                                className="w-3 h-3"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{item?.productDetails?.productName}</p>
                            <p className="text-xs text-gray-500 font-mono">{item?.productDetails?.productId}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Chip size="sm" variant="flat" color="primary" className="text-xs">
                                    {item?.productDetails?.category?.categoryName || 'N/A'}
                                </Chip>
                            </div>
                        </div>
                    </div>
                );
            case "location":
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:map-marker" className="text-blue-500 text-sm" />
                            <Chip color="primary" variant="flat" size="sm" className="font-mono">
                                {item?.binDetails?.binCode}
                            </Chip>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:warehouse" className="text-gray-400 text-sm" />
                            <span className="text-xs text-gray-600">{item?.warehouseDetails?.warehouseName}</span>
                        </div>
                        <Chip
                            size="sm"
                            variant="dot"
                            color={item.status === "AVAILABLE" ? "success" : "warning"}
                            className="text-xs"
                        >
                            {item.status === "AVAILABLE" ? "Có sẵn" : "Hạn chế"}
                        </Chip>
                    </div>
                );
            case "quantities":
                return (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Hệ thống:</span>
                            <span className="font-semibold text-blue-600">{item.systemQuantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Thực tế:</span>
                            <span className="font-semibold text-green-600">{item.actualQuantity}</span>
                        </div>
                        <Divider className="my-1" />
                        <div className="text-center">
                            <Progress
                                value={(item.actualQuantity / item.systemQuantity) * 100}
                                color={item.actualQuantity === item.systemQuantity ? "success" : "warning"}
                                size="sm"
                                className="max-w-md"
                            />
                        </div>
                    </div>
                );
            case "difference":
                const diff = item.difference;
                return (
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            diff > 0 ? 'bg-green-100 text-green-700' :
                                diff < 0 ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                        }`}>
                            <Icon
                                icon={diff > 0 ? "mdi:arrow-up" : diff < 0 ? "mdi:arrow-down" : "mdi:equal"}
                                className="text-xs"
                            />
                            {diff > 0 ? '+' : ''}{diff}
                        </div>
                    </div>
                );
            case "reason":
                return (
                    <div className="max-w-32">
                        <p className="text-sm font-medium text-gray-700">{item.adjustmentReason || 'N/A'}</p>
                        {item.checkNotes && (
                            <p className="text-xs text-gray-500 mt-1 truncate" title={item.checkNotes}>
                                {item.checkNotes}
                            </p>
                        )}
                    </div>
                );
            case "actions":
                return (
                    <div className="flex gap-1">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            title="Chỉnh sửa"
                            onClick={() => handleEditProduct(item)}
                        >
                            <Icon icon="mdi:pencil" />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            title="Xóa"
                            onClick={() => onRemoveProduct(item.inventoryWarehouseId)}
                        >
                            <Icon icon="mdi:delete" />
                        </Button>
                    </div>
                );
            default:
                return item[columnKey as keyof InventoryCheckItem];
        }
    };

    return (
        <>
            <Table
                aria-label="Selected products table"
                classNames={{
                    wrapper: "shadow-none rounded-none",
                    th: "bg-gray-50 text-gray-700 font-semibold text-sm",
                    td: "py-4 text-sm",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody>
                    {selectedProducts.map((item) => (
                        <TableRow key={item.inventoryWarehouseId} className="hover:bg-gray-50">
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <StockMovementAdjustmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inventoryItem={selectedProduct}
                onSubmit={handleModalSubmit}
            />
        </>
    );
};

export default CheckSheetTable;