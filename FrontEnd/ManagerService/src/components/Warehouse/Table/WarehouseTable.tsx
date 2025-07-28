import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Pagination, Spinner
} from "@heroui/react";

interface WarehouseTableProps {
    loading: boolean;
    warehouses: any[];
    onWarehouseSelect: (warehouseId: string) => void;
    selectedWarehouseId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({loading,
                                                           warehouses,
                                                           onWarehouseSelect,
                                                           selectedWarehouseId,
                                                           totalPage,
                                                           currentPage,
                                                           onPageChange
                                                       }) => {
    const columns = [
        { key: "warehouseName", label: "Tên kho" },
        { key: "address", label: "Địa chỉ" },
        { key: "capacity", label: "Sức chứa" },
        { key: "currentStock", label: "Tồn kho hiện tại" },
        { key: "status", label: "Trạng thái" },
        { key: "createdAt", label: "Ngày tạo" }
    ];

    const renderCell = (warehouse: any, columnKey: string) => {
        switch (columnKey) {
            case "warehouseName":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {warehouse.warehouseName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {warehouse.warehouseCode || ""}
                        </span>
                    </div>
                );
            case "address":
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {warehouse.address || "N/A"}
                    </span>
                );
            case "capacity":
                return (
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {warehouse.capacity ? `${warehouse.capacity.toLocaleString()} m³` : "N/A"}
                    </span>
                );
            case "currentStock":
                const stockPercentage = warehouse.capacity ?
                    Math.round((warehouse.currentStock / warehouse.capacity) * 100) : 0;
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {warehouse.currentStock?.toLocaleString() || "0"} m³
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                                className={`h-1.5 rounded-full ${
                                    stockPercentage > 80 ? 'bg-red-500' :
                                        stockPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                );
            case "manager":
                return (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {warehouse.manager?.fullName || "Chưa phân công"}
                    </span>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={warehouse.status === "Active" ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                    >
                        {warehouse.status === "Active" ? "Hoạt động" : "Tạm dừng"}
                    </Chip>
                );
            case "createdAt":
                return (
                    <div className="inline-flex flex-col text-start leading-tight">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {warehouse.createdAt
                                ? new Date(warehouse.createdAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {warehouse.createdAt
                                ? new Date(warehouse.createdAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : ""}
                        </span>
                    </div>
                );
            default:
                return warehouse[columnKey] || "N/A";
        }
    };

    return (
        <div className="space-y-4">
            <Table
                aria-label="Warehouse table"
                selectionMode="single"
                classNames={{
                    wrapper: "shadow-none rounded-lg",
                    th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                    td: "border-b border-gray-100 dark:border-gray-700 py-3"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                            isLoading={loading}
                            loadingContent={<Spinner label="Loading..." />}
                            items={warehouses}
                            emptyContent="Không có dữ liệu kho">
                    {(warehouse) => (
                        <TableRow
                            key={warehouse.warehouseId}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedWarehouseId === warehouse.warehouseId ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                            }`}
                            onClick={() => onWarehouseSelect(warehouse.warehouseId)}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(warehouse, columnKey.toString())}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="flex justify-center py-4">
                    <Pagination
                        total={totalPage}
                        page={currentPage}
                        onChange={onPageChange}
                        showControls
                        classNames={{
                            cursor: "bg-indigo-600 text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default WarehouseTable;