import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner, Avatar } from "@heroui/react";
import {Package, Calendar, AlertCircle, TrendingUp, MapPin, Warehouse} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import { MiddleGetInventoryWarehouse} from "@/Store/Thunk/InventoryWarehouseThunk.tsx";
import {InventoryWarehouseSelector} from "@/Store/Selector.tsx";
import { InventoryWarehouse } from "@/Store/InventoryWarehouseSlice";
import StockMovementModal from "@/components/Staff/InventoryCheck/Modal/StockMovementModal.tsx";

interface ProductListProps {
    selectedBinId?: string;
    binCode?: string;
}



export const ProductList: React.FC<ProductListProps> = ({
                                                            selectedBinId,
                                                            binCode
                                                        }) => {
    const [loading, setLoading] = useState(false);
    const productsSelect: InventoryWarehouse[] = useSelector(InventoryWarehouseSelector) || [];
    const products:InventoryWarehouse[] = productsSelect.length !== 0 ? productsSelect : [];
    const [selectedItem, setSelectedItem] = useState<InventoryWarehouse | null>(null);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedBinId) {
            fetchProductsByBin(selectedBinId);
        }
    }, [selectedBinId]);

    const fetchProductsByBin = async (binId: string) => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetInventoryWarehouse(binId));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE": return "success";
            case "RESERVED": return "warning";
            case "EXPIRED": return "danger";
            default: return "default";
        }
    };
    const handleClick = (item: InventoryWarehouse) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    const getStockLevelColor = (current: number, min: number, maxStockLevel: number) => {
        if (current <= min) return "danger";
        if (current <= min * 1.5) return "warning";
        return "success";
    };

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    };

    const columns = [
        { name: "Product", uid: "product" },
        { name: "Quantity", uid: "quantity" },
        { name: "Stock Level", uid: "stockLevel" },
        { name: "Expiry Date", uid: "expiryDate" },
        { name: "Bin Info", uid: "binInfo" },
        { name: "Status", uid: "status" }
    ];

    const renderCell = (item: InventoryWarehouse, columnKey: string) => {
        switch (columnKey) {
            case "product":
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={item.productDetails?.urlImageProduct}
                            size="sm"
                            fallback={<Package className="w-4 h-4" />}
                            className="flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <p className="text-bold text-sm">
                                {item.productDetails?.productName}
                            </p>
                            <p className="text-xs text-default-400">
                                SKU: {item.productDetails?.sku}
                            </p>
                            <p className="text-xs text-default-500">
                                {item.productDetails?.price?.toLocaleString('vi-VN')} ₫/{item.productDetails?.unit?.shortName}
                            </p>
                        </div>
                    </div>
                );
            case "quantity":
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-bold text-sm">
                                {item.quantity} {item.productDetails?.unit?.shortName}
                            </span>
                        </div>
                        <div className="text-xs text-default-400">
                            Total: {item.inventoryProduct?.totalQuantity} {item.productDetails?.unit?.shortName}
                        </div>
                    </div>
                );
            case "stockLevel":
                const stockColor = getStockLevelColor(
                    item.inventoryProduct?.totalQuantity,
                    item.inventoryProduct?.minStockLevel,
                    item.inventoryProduct?.maxStockLevel
                );
                return (
                    <div className="flex flex-col gap-1">
                        <Chip
                            color={stockColor}
                            size="sm"
                            variant="flat"
                            startContent={<TrendingUp className="w-3 h-3" />}
                        >
                            {item.inventoryProduct?.totalQuantity <= item.inventoryProduct?.minStockLevel ? "Low Stock" : "Normal"}
                        </Chip>
                        <div className="text-xs text-default-400">
                            Min: {item.inventoryProduct?.minStockLevel} | Max: {item.inventoryProduct?.maxStockLevel}
                        </div>
                    </div>
                );
            case "expiryDate":
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-sm">
                                {new Date(item?.expiryDate||"").toLocaleDateString("vi-VN")}
                            </span>
                            {isExpiringSoon(item?.expiryDate||"") && (
                                <div className="flex items-center gap-1 text-amber-600">
                                    <AlertCircle className="w-3 h-3" />
                                    <span className="text-xs">Expiring soon</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case "binInfo":
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {item.binDetails?.binCode}
                            </span>
                        </div>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={getStatusColor(item.status)}
                        size="sm"
                        variant="flat"
                    >
                        {item.status}
                    </Chip>
                );
            default:
                // @ts-ignore
                return <span>{item[columnKey as keyof InventoryWarehouse]}</span>;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Products in Bin
                        </h2>
                        {binCode && (
                            <div className="flex items-center gap-2 mt-1">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Bin: {binCode}
                                </p>
                            </div>
                        )}
                        {products.length > 0 && products[0].warehouseDetails && (
                            <div className="flex items-center gap-2 mt-1">
                                <Warehouse className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {products[0].warehouseDetails.warehouseName}
                                </p>
                            </div>
                        )}
                    </div>
                    <Chip size="sm" variant="flat" color="primary">
                        {products?.length} items
                    </Chip>
                </div>
            </CardHeader>

            <CardBody>
                {!selectedBinId ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Select a bin to view its products
                        </p>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : products?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            No products found in this bin
                        </p>
                    </div>
                ) : (
                    <Table aria-label="Products in bin">
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={products}>
                            {(item) => (
                                <TableRow onClick={()=>handleClick(item)} key={item.inventoryWarehouseId}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(item, columnKey as string)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
            <StockMovementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inventoryItem={selectedItem}
            />
        </Card>
    );
};