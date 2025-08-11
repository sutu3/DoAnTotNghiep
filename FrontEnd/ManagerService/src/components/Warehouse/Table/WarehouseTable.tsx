import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Pagination,
    Spinner,
    Progress,
    Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {Warehouse} from "@/Store/WarehouseSlice.tsx";

interface WarehouseTableProps {
    loading: boolean;
    warehouses: any[];
    onWarehouseSelect: (warehouseId: string) => void;
    selectedWarehouseId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({
                                                           loading,
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
        { key: "binStatus", label: "Trạng thái Bins" },
        { key: "stackInfo", label: "Thông tin Stack" },
        { key: "utilization", label: "Tỷ lệ sử dụng" },
        { key: "createdAt", label: "Ngày tạo" }
    ];

    const calculateBinStats = (bins: any[]) => {
        if (!bins || bins.length === 0) return { empty: 0, full: 0, total: 0, utilization: 0 };

        const empty = bins.filter(bin => bin.status === "EMPTY").length;
        const full = bins.filter(bin => bin.status === "FULL").length;
        const total = bins.length;
        const utilization = Math.round((full / total) * 100);

        return { empty, full, total, utilization };
    };

    const calculateTotalOccupancy = (bins: any[]) => {
        if (!bins || bins.length === 0) return 0;
        return bins.reduce((sum, bin) => sum + (bin.currentOccupancy || 0), 0);
    };

    const renderCell = (warehouse: Warehouse, columnKey: string) => {
        const binStats = calculateBinStats(warehouse?.bins);
        const totalOccupancy = calculateTotalOccupancy(warehouse?.bins);

        switch (columnKey) {
            case "warehouseName":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {warehouse.warehouseName || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {warehouse.warehouseId?.slice(-8)}...
                        </span>
                        {warehouse.description && (
                            <Tooltip content={warehouse.description}>
                                <span className="text-xs text-blue-600 cursor-help truncate max-w-[50px]">
                                    {warehouse.description}
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );

            case "address":
                const fullAddress = [warehouse.address, warehouse.street, warehouse.district, warehouse.country]
                    .filter(Boolean)
                    .join(", ");

                return (
                    <Tooltip content={fullAddress}>
                        <div className="flex flex-col max-w-[150px] cursor-help">
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {warehouse.address || "N/A"}
                </span>
                            <span className="text-xs text-gray-500 truncate">
                    {warehouse.street}, {warehouse.district}
                </span>
                            <span className="text-xs text-gray-500 truncate">
                    {warehouse.country}
                </span>
                        </div>
                    </Tooltip>
                );

            case "binStatus":
                return (
                    <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex gap-1 flex-wrap">
                            <Chip size="sm" color="success" variant="dot">
                                {binStats.empty} Trống
                            </Chip>
                            <Chip size="sm" color="warning" variant="dot">
                                {binStats.full} Đầy
                            </Chip>
                        </div>
                        <Progress
                            size="sm"
                            value={binStats.utilization}
                            color={binStats.utilization > 80 ? "danger" : binStats.utilization > 50 ? "warning" : "success"}
                            className="max-w-md"
                        />
                        <span className="text-xs text-gray-500">
                            {binStats.utilization}% sử dụng ({binStats.total} bins)
                        </span>
                    </div>
                );

            case "stackInfo":
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:layers" className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                {warehouse.stacks?.length || 0} Stacks
                            </span>
                        </div>
                        {warehouse.stacks?.slice(0, 2).map((stack: any, index: number) => (
                            <Tooltip key={stack.stackId} content={stack.description}>
                                <span className="text-xs text-gray-600 truncate max-w-[120px] cursor-help">
                                    • {stack.stackName}
                                </span>
                            </Tooltip>
                        ))}
                        {warehouse?.stacks?.length > 2 && (
                            <span className="text-xs text-gray-500">
                                +{warehouse.stacks.length - 2} khác...
                            </span>
                        )}
                    </div>
                );

            case "utilization":
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:package-variant" className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">
                                {totalOccupancy.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Tổng chiếm dụng
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    binStats.utilization > 80 ? 'bg-red-500' :
                                        binStats.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(binStats.utilization, 100)}%` }}
                            />
                        </div>
                    </div>
                );

            case "createdAt":
                return (
                    <div className="flex flex-col">
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
                        {warehouse.updatedAt && warehouse.updatedAt !== warehouse.createdAt && (
                            <span className="text-xs text-blue-600">
                                Cập nhật: {new Date(warehouse.updatedAt).toLocaleDateString("vi-VN")}
                            </span>
                        )}
                    </div>
                );

            default:
                return warehouse[columnKey] || "N/A";
        }
    };

    return (
        <div className="space-y-4">
            <Table
                aria-label="Enhanced Warehouse table"
                selectionMode="single"
                classNames={{
                    wrapper: "shadow-none rounded-lg",
                    th: "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                    td: "border-b border-gray-100 dark:border-gray-700 py-4"
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
                    className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                    isLoading={loading}
                    loadingContent={<Spinner label="Đang tải dữ liệu kho..." />}
                    items={warehouses}
                    emptyContent={
                        <div className="text-center py-8">
                            <Icon icon="mdi:warehouse" className="text-4xl text-gray-300 mb-2" />
                            <p className="text-gray-500">Không có dữ liệu kho</p>
                        </div>
                    }
                >
                    {(warehouse) => (
                        <TableRow
                            key={warehouse.warehouseId}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
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

            {/* Enhanced Pagination */}
            {totalPage > 1 && (
                <div className="flex justify-between items-center py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Hiển thị {((currentPage - 1) * 10) + 1} đến {Math.min(currentPage * 10, warehouses.length)}
                        trong tổng số {warehouses.length} kho
                    </span>
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