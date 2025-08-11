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

interface UnitTableProps {
    loading: boolean;
    units: any[];
    onUnitSelect: (unitId: string) => void;
    selectedUnitId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const UnitTable: React.FC<UnitTableProps> = ({
                                                 units,
                                                 loading,
                                                 onUnitSelect,
                                                 selectedUnitId,
                                                 totalPage,
                                                 currentPage,
                                                 onPageChange
                                             }) => {
    console.log(loading)
    const columns = [
        { key: "unitName", label: "Tên đơn vị" },
        { key: "shortName", label: "Tên viết tắt" },
        { key: "ratioToBase", label: "Tỷ lệ quy đổi" },
        { key: "groupUnitName", label: "Nhóm đơn vị" },
        { key: "isDefault", label: "Mặc định" },
        { key: "createdAt", label: "Ngày tạo" }
    ];

    const renderCell = (unit: any, columnKey: string) => {
        switch (columnKey) {
            case "unitName":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {unit.unitName || "N/A"}
                        </span>
                    </div>
                );
            case "shortName":
                return (
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-white">
                        {unit.shortName || "N/A"}
                    </span>
                );
            case "ratioToBase":
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {unit.ratioToBase ? `${unit.ratioToBase}x` : "1x"}
                    </span>
                );
            case "groupUnitName":
                return (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {unit.groupUnit?.groupName || "N/A"}
                    </span>
                );
            case "isDefault":
                return (
                    <Chip
                        className="capitalize"
                        color={unit.isDefault ? "success" : "default"}
                        size="sm"
                        variant="flat"
                    >
                        {unit.isDefault ? "Mặc định" : "Thường"}
                    </Chip>
                );
            case "createdAt":
                return (
                    <div className="inline-flex flex-col text-start leading-tight">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {unit.createdAt
                                ? new Date(unit.createdAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {unit.createdAt
                                ? new Date(unit.createdAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : ""}
                        </span>
                    </div>
                );
            default:
                return unit[columnKey] || "N/A";
        }
    };

    return (
        <div className="space-y-4">
            <Table
                aria-label="Unit table"
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
                <TableBody className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                           isLoading={loading}
                           loadingContent={<Spinner label="Loading..." />}
                           items={units}
                           emptyContent="Không có dữ liệu đơn vị">
                    {(unit) => (
                        <TableRow
                            key={unit.unitID}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedUnitId === unit.unitID ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                            }`}
                            onClick={() => onUnitSelect(unit.unitID)}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(unit, columnKey.toString())}
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
                            cursor: "bg-orange-600 text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default UnitTable;