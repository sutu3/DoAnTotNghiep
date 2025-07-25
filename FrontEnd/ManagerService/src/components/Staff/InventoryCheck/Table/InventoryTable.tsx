import React, {useEffect, useState} from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Card,
    CardBody,
    CardHeader,
    Pagination,
    Button
} from '@heroui/react';
import { Icon } from '@iconify/react';
import SelectWarehouse from "@/components/Admin/Tasks/SelectWarehouse.tsx";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetInventoryWarehouseByWarehouseId} from "@/Store/Thunk/InventoryWarehouseThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {InventoryWarehouseSelector} from "@/Store/Selector.tsx";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";
import StockMovementModal from "@/components/Staff/InventoryCheck/Modal/StockMovementModal.tsx";
import StockMovementAdjustmentModal from "@/components/Staff/InventoryCheck/Modal/StockMovementAdjustmentModal.tsx";
import {StockMovementCreate} from "@/Store/StockMovementSlice.tsx";
import {MiddleAddStockMovement} from "@/Store/Thunk/StockMovementThunk.tsx";

interface InventoryTableProps {
    searchFilter: string;
    categoryFilter: string;
    statusFilter: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({}) => {
    const [warehouse,setWarehouse]=useState<string>("")
    const dispatch=useDispatch();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryWarehouse | null>(null);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [selectedItemForAdjustment, setSelectedItemForAdjustment] = useState<InventoryWarehouse | null>(null);

// Thêm hàm xử lý điều chỉnh


    useEffect(() => {
        const fetch=async()=>{
            const page:pageApi={pageNumber:currentPage-1,pageSize:itemsPerPage}
            await (dispatch as any)(MiddleGetInventoryWarehouseByWarehouseId(warehouse,page))
        }
        if(warehouse!=""){
            fetch()
        }
    }, [warehouse]);

    // Mock data - trong thực tế sẽ lấy từ Redux store
    const inventoryData:InventoryWarehouse[] = useSelector(InventoryWarehouseSelector)

    const columns = [
        { key: "productInfo", label: "Thông tin sản phẩm" },
        { key: "location", label: "Vị trí" },
        { key: "quantity", label: "Số lượng" },
        { key: "status", label: "Trạng thái" },
        { key: "expiry", label: "Hạn sử dụng" },
        { key: "actions", label: "Thao tác" }
    ];

    const handleViewMovements = (item: InventoryWarehouse) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    const handleAdjustStock = (item: InventoryWarehouse) => {
        setSelectedItemForAdjustment(item);
        setIsAdjustmentModalOpen(true);
    };
    const handleSubmitAdjustment = async (adjustmentData: StockMovementCreate) => {
      await (dispatch as any)(MiddleAddStockMovement(adjustmentData))
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case "AVAILABLE": return "success";
            case "LOW_STOCK": return "warning";
            case "OUT_OF_STOCK": return "danger";
            case "EXPIRED": return "danger";
            default: return "default";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "AVAILABLE": return "Có sẵn";
            case "LOW_STOCK": return "Sắp hết";
            case "OUT_OF_STOCK": return "Hết hàng";
            case "EXPIRED": return "Hết hạn";
            default: return status;
        }
    };

    const renderCell = (item: InventoryWarehouse, columnKey: string) => {
        switch (columnKey) {
            case "productInfo":
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Icon icon="mdi:package-variant" className="text-white text-lg" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {item?.productDetails?.productName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item?.productDetails?.productId}
                            </p>
                        </div>
                    </div>
                );
            case "location":
                return (
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:map-marker" className="text-gray-500" />
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {item?.binDetails?.binCode}
                        </span>
                    </div>
                );
            case "quantity":
                const isLowStock = item.quantity <= item?.inventoryProduct?.minStockLevel;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isLowStock ? 'text-orange-600' : 'text-gray-900 dark:text-white'}`}>
                                {item.quantity}
                            </span>
                            {isLowStock && (
                                <Icon icon="mdi:alert-circle" className="text-orange-500 text-sm" />
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            Min: {item?.inventoryProduct?.minStockLevel} | Max: {item?.inventoryProduct?.maxStockLevel}
                        </div>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        color={getStatusColor(item.status)}
                        variant="flat"
                        size="sm"
                        startContent={
                            <Icon
                                icon={
                                    item.status === "AVAILABLE" ? "mdi:check-circle" :
                                        item?.inventoryProduct?.minStockLevel > item.quantity ? "mdi:alert-circle" :
                                            item.status === "EXPIRED" ? "mdi:close-circle" :
                                                "mdi:calendar-alert"
                                }
                                className="text-xs"
                            />
                        }
                    >
                        {getStatusText(item.status)}
                    </Chip>
                );
            case "expiry":
                const isExpiringSoon = new Date(item?.expiryDate||"N/A") <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                return (
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="mdi:calendar"
                            className={isExpiringSoon ? "text-red-500" : "text-gray-500"}
                        />
                        <div>
                            <div className={`text-sm ${isExpiringSoon ? 'text-red-600 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                                {new Date(item.expiryDate||"N/A").toLocaleDateString('vi-VN')}
                            </div>
                            {isExpiringSoon && (
                                <div className="text-xs text-red-500">Sắp hết hạn</div>
                            )}
                        </div>
                    </div>
                );
            case "actions":
                return (
                    <div className="flex gap-1">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleViewMovements(item)}
                        >
                            <Icon icon="mdi:eye" />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            onClick={() => handleAdjustStock(item)}
                        >
                            <Icon icon="mdi:pencil" />
                        </Button>
                    </div>
                );
            default:
                return item[columnKey];
        }
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:table" className="text-xl text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Danh Sách Tồn Kho
                        </h3>
                    </div>
                    <div className="text-sm text-gray-500">
                        {inventoryData.length} sản phẩm
                    </div>
                    <SelectWarehouse warehouse={warehouse} setWarehouse={setWarehouse}/>
                </div>
            </CardHeader>
            <CardBody>
                <Table
                    aria-label="Inventory table"
                    classNames={{
                        wrapper: "shadow-none",
                        th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                        td: "py-3",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.key}>
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                        {inventoryData.map((item) => (
                            <TableRow key={item.inventoryWarehouseId}>
                                {(columnKey) => (
                                    <TableCell>
                                        {renderCell(item, columnKey as string)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                        total={Math.ceil(inventoryData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={setCurrentPage}
                        size="sm"
                        showControls
                    />
                    <span className="text-sm text-gray-500">
                        Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, inventoryData.length)} của {inventoryData.length}
                    </span>
                </div>
            </CardBody>
            <StockMovementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inventoryItem={selectedItem}
            />

            <StockMovementAdjustmentModal
                isOpen={isAdjustmentModalOpen}
                onClose={() => setIsAdjustmentModalOpen(false)}
                inventoryItem={selectedItemForAdjustment}
                onSubmit={handleSubmitAdjustment}
            />
        </Card>
    );
};

export default InventoryTable;