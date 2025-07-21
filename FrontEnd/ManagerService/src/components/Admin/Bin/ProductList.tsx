import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from "@heroui/react";
import { Package, Calendar, AlertCircle } from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import { MiddleGetInventoryWarehouse} from "@/Store/Thunk/InventoryWarehouseThunk.tsx";
import {InventoryWarehouseSelector} from "@/Store/Selector.tsx";

interface ProductListProps {
    selectedBinId?: string;
    binCode?: string;
}

interface InventoryWarehouseItem {
    inventoryWarehouseId: string;
    product: string;
    quantity: number;
    expiryDate: string;
    status: string;
    productDetails?: {
        productName: string;
        productCode: string;
        category: string;
    };
}

export const ProductList: React.FC<ProductListProps> = ({
                                                            selectedBinId,
                                                            binCode
                                                        }) => {
    const [loading, setLoading] = useState(false);
    const productsSelete: InventoryWarehouseItem[] = useSelector(InventoryWarehouseSelector) || [];
    const products = productsSelete.length !== 0 ? productsSelete : [];
    console.log(products)
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedBinId) {
            fetchProductsByBin(selectedBinId);
        }
    }, [selectedBinId]);

    const fetchProductsByBin = async (binId: string) => {
        setLoading(true);
        try {
            // Gọi API InventoryWarehouse để lấy sản phẩm theo bin ID
            await (dispatch as any)(MiddleGetInventoryWarehouse(binId))
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
        { name: "Expiry Date", uid: "expiryDate" },
        { name: "Status", uid: "status" }
    ];

    const renderCell = (item: InventoryWarehouseItem, columnKey: string) => {
        switch (columnKey) {
            case "product":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">
                            {item.productDetails?.productName || item.product}
                        </p>
                        <p className="text-bold text-sm text-default-400">
                            {item.productDetails?.productCode}
                        </p>
                    </div>
                );
            case "quantity":
                return (
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-bold text-sm">{item.quantity}</span>
                    </div>
                );
            case "expiryDate":
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div className="flex flex-col">
              <span className="text-sm">
                {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
              </span>
                            {isExpiringSoon(item.expiryDate) && (
                                <div className="flex items-center gap-1 text-amber-600">
                                    <AlertCircle className="w-3 h-3" />
                                    <span className="text-xs">Expiring soon</span>
                                </div>
                            )}
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
                return <span>{item[columnKey as keyof InventoryWarehouseItem]}</span>;
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Bin: {binCode}
                            </p>
                        )}
                    </div>
                    <Chip size="sm" variant="flat">
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
                                <TableRow key={item.inventoryWarehouseId}>
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
        </Card>
    );
};