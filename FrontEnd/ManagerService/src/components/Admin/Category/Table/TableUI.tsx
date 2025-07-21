import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination, Spinner
} from "@heroui/react";
import {Category} from "@/Store/CategorySlice.tsx";

interface CategoryTableProps {
    loading?: boolean;
    categories: Category[];
    onCategorySelect: (categoryId: string) => void;
    selectedCategoryId?: string;
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
    loading,
                                                         categories,
                                                         onCategorySelect,
                                                         selectedCategoryId,
                                                         totalPage,
                                                         currentPage,
                                                         onPageChange
                                                     }) => {
    const columns = [
        { key: "categoryName", label: "Tên danh mục" },
        { key: "description", label: "Mô tả" },
        { key: "createByUser", label: "Người tạo" },
        { key: "createdAt", label: "Ngày tạo" }
    ];

    const renderCell = (category: any, columnKey: string) => {
        switch (columnKey) {
            case "categoryName":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {category.categoryName || "N/A"}
                        </span>
                    </div>
                );
            case "description":
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-300 max-w-xs line-clamp-2">
                        {category.description || "N/A"}
                    </span>
                );
            case "createByUser":
                return (
                    <span className="text-blue-400 font-medium">
                        {category.createByUser?.userName || "N/A"}
                    </span>
                );
            case "createdAt":
                return (
                    <div className="inline-flex flex-col text-start leading-tight">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {category.createdAt
                                ? new Date(category.createdAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {category.createdAt
                                ? new Date(category.createdAt).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : ""}
                        </span>
                    </div>
                );
            default:
                return category[columnKey] || "N/A";
        }
    };

    return (
        <div className="space-y-4">
            <Table
                aria-label="Category table"
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
                             items={categories} emptyContent="Không có dữ liệu danh mục">
                    {(category) => (
                        <TableRow
                            key={category.categoryId}
                            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedCategoryId === category.categoryId ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                            }`}
                            onClick={() => onCategorySelect(category.categoryId)}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(category, columnKey.toString())}
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
                            cursor: "bg-purple-600 text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryTable;